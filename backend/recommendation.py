import ast
import logging
import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from sklearn.metrics.pairwise import linear_kernel


LOGGER = logging.getLogger(__name__)
POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500"
POSTER_FALLBACK_URL = "https://placehold.co/500x750"


class MovieNotFoundError(ValueError):
    pass


class RecommendationEngine:
    def __init__(self, model_dir=None):
        self.model_dir = Path(model_dir or Path(__file__).resolve().parent / "models")
        self.movies_df = self._load_pickle("movies_df.pkl")
        self.tfidf_matrix = self._load_pickle("tfidf_matrix.pkl")
        self.indices = self._load_pickle("indices.pkl")
        self.tfidf_vectorizer = self._load_pickle("tfidf_vectorizer.pkl")
        self.metadata = self._load_metadata()
        self.title_lookup = self._build_title_lookup()
        self.movie_titles = self._build_movie_titles()
        LOGGER.info("Loaded %s movies into recommendation engine", len(self.movie_titles))

    def _load_pickle(self, filename):
        path = self.model_dir / filename
        with path.open("rb") as file:
            return pickle.load(file)

    def _load_metadata(self):
        path = self.model_dir / "movies_metadata.csv"
        if not path.exists():
            LOGGER.warning("movies_metadata.csv not found; falling back to movies_df metadata")
            return pd.DataFrame()

        columns = [
            "title",
            "overview",
            "vote_average",
            "release_date",
            "genres",
            "poster_path",
        ]
        metadata = pd.read_csv(path, usecols=columns, low_memory=False)
        metadata["title"] = metadata["title"].fillna("").astype(str)
        metadata = metadata[metadata["title"].str.strip().ne("")]
        metadata = metadata.drop_duplicates(subset=["title"], keep="first")
        return metadata.set_index("title", drop=False)

    def _build_title_lookup(self):
        lookup = {}
        for title in self.movies_df["title"].dropna().astype(str):
            key = title.casefold().strip()
            lookup.setdefault(key, title)
        return lookup

    def _build_movie_titles(self):
        return (
            self.movies_df["title"]
            .dropna()
            .astype(str)
            .drop_duplicates()
            .sort_values(key=lambda values: values.str.lower())
            .tolist()
        )

    def get_movie_titles(self):
        return self.movie_titles

    def recommend(self, movie_title, n=10):
        title = self._resolve_title(movie_title)
        raw_index = self.indices[title]
        movie_index = self._get_single_index(raw_index)

        similarities = linear_kernel(self.tfidf_matrix[movie_index], self.tfidf_matrix).flatten()
        sorted_indices = np.argsort(similarities)[::-1]
        sorted_indices = sorted_indices[sorted_indices != movie_index]
        sorted_indices = [index for index in sorted_indices if 0 <= index < len(self.movies_df)]
        top_indices = sorted_indices[:n]

        recommendations = []
        for index in top_indices:
            row = self.movies_df.iloc[index]
            score = float(similarities[index])
            recommendations.append(self._enrich_movie(row.get("title", ""), score))

        return recommendations

    def trending(self, limit=8):
        source = self.metadata if not self.metadata.empty else self.movies_df
        source = source.copy()
        if "vote_average" not in source.columns:
            return []

        source["vote_average"] = pd.to_numeric(source["vote_average"], errors="coerce")
        top_rated = source.dropna(subset=["vote_average"])
        top_rated = top_rated[top_rated["vote_average"] > 0]
        top_rated = top_rated.sort_values("vote_average", ascending=False).head(250)
        if top_rated.empty:
            return []

        sample_size = min(limit, len(top_rated))
        sampled = top_rated.sample(n=sample_size)
        return [self._enrich_movie(row.get("title", ""), None) for _, row in sampled.iterrows()]

    def _resolve_title(self, movie_title):
        if not movie_title or not str(movie_title).strip():
            raise MovieNotFoundError("Movie title is required")

        requested = str(movie_title).strip()
        title = self.title_lookup.get(requested.casefold())
        if not title or title not in self.indices:
            raise MovieNotFoundError(f"Movie not found: {requested}")
        return title

    @staticmethod
    def _get_single_index(index_value):
        if isinstance(index_value, (list, tuple, np.ndarray, pd.Series)):
            return int(index_value[0])
        return int(index_value)

    def _enrich_movie(self, title, score):
        title = str(title)
        metadata_row = self._metadata_for_title(title)

        overview = self._first_present(metadata_row, "overview", default="Overview unavailable.")
        rating = self._first_present(metadata_row, "vote_average", default="N/A")
        release_date = self._first_present(metadata_row, "release_date", default="")
        genres = self._parse_genres(self._first_present(metadata_row, "genres", default=""))
        poster_path = self._first_present(metadata_row, "poster_path", default="")

        return {
            "title": title,
            "poster": self._poster_url(poster_path),
            "rating": self._format_rating(rating),
            "overview": overview if str(overview).strip() else "Overview unavailable.",
            "release_date": str(release_date) if pd.notna(release_date) else "",
            "release_year": self._release_year(release_date),
            "genres": genres,
            "poster_path": str(poster_path) if pd.notna(poster_path) else "",
            "score": round(score, 4) if score is not None else None,
        }

    def _metadata_for_title(self, title):
        if not self.metadata.empty and title in self.metadata.index:
            return self.metadata.loc[title]

        matches = self.movies_df[self.movies_df["title"].astype(str).str.casefold() == title.casefold()]
        if not matches.empty:
            return matches.iloc[0]

        return pd.Series(dtype="object")

    @staticmethod
    def _first_present(row, column, default=""):
        if column not in row:
            return default
        value = row[column]
        if isinstance(value, pd.Series):
            value = value.iloc[0]
        if pd.isna(value):
            return default
        return value

    @staticmethod
    def _parse_genres(value):
        if value is None or (not isinstance(value, str) and pd.isna(value)):
            return []

        if isinstance(value, list):
            return [str(item.get("name", item)).strip() for item in value if item]

        text = str(value).strip()
        if not text:
            return []

        if text.startswith("["):
            try:
                parsed = ast.literal_eval(text)
                return [str(item.get("name", item)).strip() for item in parsed if item]
            except (ValueError, SyntaxError):
                return []

        return [genre.strip() for genre in text.replace(",", " ").split() if genre.strip()]

    @staticmethod
    def _poster_url(poster_path):
        if poster_path is None or pd.isna(poster_path):
            return POSTER_FALLBACK_URL
        poster_path = str(poster_path).strip()
        if not poster_path or poster_path.lower() == "nan":
            return POSTER_FALLBACK_URL
        if poster_path.startswith("http"):
            return poster_path
        return f"{POSTER_BASE_URL}/{poster_path.lstrip('/')}"

    @staticmethod
    def _format_rating(value):
        try:
            numeric = float(value)
            return f"{numeric:.1f}"
        except (TypeError, ValueError):
            return "N/A"

    @staticmethod
    def _release_year(release_date):
        if release_date is None or pd.isna(release_date):
            return "Unknown"
        text = str(release_date)
        return text[:4] if len(text) >= 4 and text[:4].isdigit() else "Unknown"
