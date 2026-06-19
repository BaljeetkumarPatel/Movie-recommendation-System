import { FaFire } from "react-icons/fa";
import MovieCard from "./MovieCard";

function TrendingMovies({ movies }) {
  if (!movies.length) return null;

  return (
    <section id="trending" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-red-500/15 text-accent">
          <FaFire />
        </span>
        <div>
          <p className="font-bold uppercase tracking-[0.24em] text-accent">Trending</p>
          <h2 className="text-3xl font-black text-white">Top Rated Discoveries</h2>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {movies.map((movie, index) => (
          <MovieCard key={`${movie.title}-${index}`} movie={movie} index={index} />
        ))}
      </div>
    </section>
  );
}

export default TrendingMovies;
