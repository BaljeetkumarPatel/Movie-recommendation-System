# MovieMind AI

A full-stack AI movie recommendation web application built with Flask, React, Vite, Tailwind CSS, Framer Motion, Axios, and a TF-IDF cosine similarity recommendation engine.

## Folder Structure

```text
movie-recommendation-system/
  backend/
    app.py
    recommendation.py
    requirements.txt
    models/
      movies_df.pkl
      tfidf_matrix.pkl
      tfidf_vectorizer.pkl
      indices.pkl
      movies_metadata.csv
    routes/
      movie_routes.py
  frontend/
    package.json
    tailwind.config.js
    postcss.config.js
    vite.config.js
    src/
      App.jsx
      main.jsx
      index.css
      components/
        Footer.jsx
        Hero.jsx
        MovieCard.jsx
        Navbar.jsx
        RecommendationGrid.jsx
        SearchBox.jsx
        TrendingMovies.jsx
      pages/
        Home.jsx
      services/
        api.js
```

## Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The Flask API runs at `http://localhost:5000`.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app runs at `http://localhost:5173`.

## API Endpoints

```http
GET /movies
```

Returns all movie titles for autocomplete.

```http
POST /recommend
Content-Type: application/json

{
  "movie": "Avatar",
  "limit": 10
}
```

Returns enriched recommendations with title, poster, rating, overview, release year, genres, and similarity score.

```http
GET /trending?limit=8
```

Returns random top-rated movies from the metadata file.

## Notes

- Set `VITE_API_URL` in `frontend/.env` if the Flask API is not running on `http://localhost:5000`.
- Set `FRONTEND_ORIGIN` for stricter Flask CORS in production.
- Posters use TMDB image URLs and fall back to `https://placehold.co/500x750`.
