import { motion } from "framer-motion";
import { FaExternalLinkAlt, FaFire, FaStar } from "react-icons/fa";

function MovieCard({ movie, index = 0 }) {
  const match = typeof movie.score === "number" ? Math.round(movie.score * 100) : null;
  const genres = Array.isArray(movie.genres) ? movie.genres.slice(0, 3) : [];

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.28) }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group flex min-h-80 flex-col justify-between rounded-lg border border-white/10 bg-panel p-5 shadow-card transition hover:border-red-400/60 hover:shadow-glow"
    >
      <div className="space-y-4">
        {match !== null && (
          <div className="inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-black text-white">
            <FaFire />
            {match}% Match
          </div>
        )}

        <div>
          <h3 className="line-clamp-2 text-lg font-black text-white">{movie.title}</h3>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-1 font-bold text-gold">
              <FaStar />
              {movie.rating}
            </span>
            <span>{movie.release_year || "Unknown"}</span>
          </div>
        </div>

        <p className="line-clamp-4 min-h-24 text-sm leading-6 text-slate-400">{movie.overview}</p>

        <div className="flex min-h-8 flex-wrap gap-2">
          {genres.length > 0 ? (
            genres.map((genre) => (
              <span key={genre} className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-bold text-slate-300">
                {genre}
              </span>
            ))
          ) : (
          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs font-bold text-slate-500">Genre unavailable</span>
          )}
        </div>
      </div>

      <a
        href={`https://www.google.com/search?q=${encodeURIComponent(`${movie.title} movie`)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm font-black text-white transition hover:border-accent hover:bg-accent"
      >
        View Details
        <FaExternalLinkAlt />
      </a>
    </motion.article>
  );
}

export default MovieCard;
