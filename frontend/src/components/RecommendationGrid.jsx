import { motion } from "framer-motion";
import { FaFilm, FaMagic } from "react-icons/fa";
import MovieCard from "./MovieCard";

function SkeletonCard() {
  return (
    <div className="min-h-80 rounded-lg border border-white/10 bg-panel p-5">
      <div className="space-y-4">
        <div className="h-7 w-28 animate-pulse rounded-full bg-slate-700" />
        <div className="h-5 animate-pulse rounded bg-slate-700" />
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-700" />
        <div className="h-24 animate-pulse rounded bg-slate-700" />
        <div className="flex gap-2">
          <div className="h-7 w-20 animate-pulse rounded-full bg-slate-700" />
          <div className="h-7 w-24 animate-pulse rounded-full bg-slate-700" />
        </div>
      </div>
      <div className="mt-5 h-11 animate-pulse rounded bg-slate-700" />
    </div>
  );
}

function RecommendationGrid({ recommendations, isLoading }) {
  if (isLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3 text-xl font-black text-white">
          <FaMagic className="text-accent" />
          Loading recommendations...
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      </section>
    );
  }

  if (!recommendations.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex min-h-64 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/5 p-8 text-center"
        >
          <FaFilm className="mb-5 text-5xl text-accent" />
          <h2 className="text-2xl font-black text-white">No recommendations yet</h2>
          <p className="mt-2 max-w-md text-slate-400">Search for a movie to begin.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.24em] text-accent">Recommended for you</p>
          <h2 className="mt-2 text-3xl font-black text-white">Your AI Picks</h2>
        </div>
        <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-black text-slate-200">
          {recommendations.length} Movies Found
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {recommendations.map((movie, index) => (
          <MovieCard key={`${movie.title}-${index}`} movie={movie} index={index} />
        ))}
      </div>
    </section>
  );
}

export default RecommendationGrid;
