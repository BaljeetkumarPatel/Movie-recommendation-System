import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import RecommendationGrid from "../components/RecommendationGrid";
import SearchBox from "../components/SearchBox";
import TrendingMovies from "../components/TrendingMovies";
import { getMovies, getRecommendations, getTrendingMovies } from "../services/api";

const RECENT_KEY = "moviemind_recent_searches";

function Toast({ toast }) {
  if (!toast) return null;
  const Icon = toast.type === "success" ? FaCheckCircle : FaExclamationTriangle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -18, scale: 0.98 }}
      className={`fixed right-4 top-24 z-[60] flex items-center gap-3 rounded-lg border px-4 py-3 font-bold shadow-card ${
        toast.type === "success"
          ? "border-emerald-400/30 bg-emerald-500/15 text-emerald-100"
          : "border-red-400/30 bg-red-500/15 text-red-100"
      }`}
    >
      <Icon />
      {toast.message}
    </motion.div>
  );
}

function Home() {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [trending, setTrending] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
    setRecentSearches(saved);

    Promise.all([getMovies(), getTrendingMovies(8)])
      .then(([movieTitles, trendingMovies]) => {
        setMovies(movieTitles);
        setTrending(trendingMovies);
      })
      .catch(() => showToast("error", "Unable to connect to Flask API"));
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => setToast(null), 2600);
  };

  const saveRecentSearch = (movie) => {
    const updated = [movie, ...recentSearches.filter((item) => item !== movie)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const handleRecommendations = async () => {
    const movie = selectedMovie.trim();
    if (!movie) {
      showToast("error", "Movie Not Found");
      return;
    }

    setIsLoading(true);
    try {
      const results = await getRecommendations(movie, 10);
      setRecommendations(results);
      saveRecentSearch(movie);
      showToast("success", "Recommendations Loaded");
      document.getElementById("recommendations")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch (error) {
      setRecommendations([]);
      showToast("error", error.response?.data?.error || "Movie Not Found");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-midnight text-white">
      <Navbar />
      <AnimatePresence>
        <Toast toast={toast} />
      </AnimatePresence>

      <Hero>
        <SearchBox
          movies={movies}
          selectedMovie={selectedMovie}
          onSelectMovie={setSelectedMovie}
          onSubmit={handleRecommendations}
          isLoading={isLoading}
          recentSearches={recentSearches}
        />
      </Hero>

      <main id="recommendations">
        <RecommendationGrid recommendations={recommendations} isLoading={isLoading} />
        <TrendingMovies movies={trending} />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
