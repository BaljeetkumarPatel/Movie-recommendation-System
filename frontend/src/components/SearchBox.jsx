import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaClock, FaSearch, FaTimes } from "react-icons/fa";

function SearchBox({ movies, selectedMovie, onSelectMovie, onSubmit, isLoading, recentSearches }) {
  const [isFocused, setIsFocused] = useState(false);

  const suggestions = useMemo(() => {
    const query = selectedMovie.trim().toLowerCase();
    if (!query) return [];
    return movies.filter((movie) => movie.toLowerCase().includes(query)).slice(0, 8);
  }, [movies, selectedMovie]);

  const showSuggestions = isFocused && suggestions.length > 0;

  return (
    <div className="w-full max-w-4xl">
      <div className="rounded-lg border border-white/10 bg-slate-900/80 p-4 shadow-card backdrop-blur-xl sm:p-5">
        <div className="relative">
          <FaSearch className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-slate-400" />
          <input
            value={selectedMovie}
            onChange={(event) => onSelectMovie(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 150)}
            onKeyDown={(event) => {
              if (event.key === "Enter") onSubmit();
            }}
            placeholder="Search Movie..."
            className="h-16 w-full rounded-lg border border-white/10 bg-white/5 py-4 pl-14 pr-12 text-lg font-semibold text-white outline-none transition placeholder:text-slate-500 focus:border-accent focus:bg-white/10 focus:shadow-glow"
          />
          {selectedMovie && (
            <button
              type="button"
              onClick={() => onSelectMovie("")}
              className="absolute right-4 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Clear search"
            >
              <FaTimes />
            </button>
          )}

          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 right-0 top-[calc(100%+0.75rem)] z-20 overflow-hidden rounded-lg border border-white/10 bg-slate-950/95 shadow-card backdrop-blur-xl"
            >
              {suggestions.map((movie) => (
                <button
                  key={movie}
                  type="button"
                  onMouseDown={() => onSelectMovie(movie)}
                  className="flex w-full items-center gap-3 px-5 py-3 text-left text-slate-200 transition hover:bg-white/10 hover:text-white"
                >
                  <FaSearch className="text-accent" />
                  {movie}
                </button>
              ))}
            </motion.div>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={onSubmit}
            disabled={isLoading}
            className="inline-flex h-12 items-center justify-center gap-3 rounded-lg bg-accent px-6 font-black text-white shadow-glow transition hover:-translate-y-0.5 hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaSearch />
            {isLoading ? "Finding Matches..." : "Get Recommendations"}
          </button>

          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <FaClock className="text-gold" />
              {recentSearches.map((movie) => (
                <button
                  key={movie}
                  type="button"
                  onClick={() => onSelectMovie(movie)}
                  className="rounded-full border border-white/10 px-3 py-1 text-slate-300 transition hover:border-accent hover:text-white"
                >
                  {movie}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SearchBox;
