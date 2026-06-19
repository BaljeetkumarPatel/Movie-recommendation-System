import { motion } from "framer-motion";
import { FaFilm, FaMagic, FaPlayCircle, FaStar } from "react-icons/fa";

function FloatingParticles() {
  const particles = Array.from({ length: 18 }, (_, index) => ({
    id: index,
    left: `${(index * 17) % 96}%`,
    top: `${(index * 29) % 78}%`,
    delay: index * 0.22,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute text-white/10"
          style={{ left: particle.left, top: particle.top }}
          animate={{ y: [-12, 16, -12], opacity: [0.18, 0.55, 0.18], rotate: [0, 8, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, delay: particle.delay, ease: "easeInOut" }}
        >
          {particle.id % 3 === 0 ? <FaFilm /> : particle.id % 3 === 1 ? <FaStar /> : <FaPlayCircle />}
        </motion.span>
      ))}
    </div>
  );
}

function Hero({ children }) {
  return (
    <section id="home" className="movie-backdrop relative min-h-[92vh] overflow-hidden pt-24">
      <FloatingParticles />
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-slate-950 to-transparent" />
      <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-4 pb-14 pt-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-100">
            <FaMagic className="text-accent" />
            TF-IDF powered recommendations
          </div>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-6xl lg:text-7xl">
            AI Movie Recommendation Engine
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
            Find your next favorite movie instantly with smart content similarity, rich metadata, and a cinematic search experience.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
