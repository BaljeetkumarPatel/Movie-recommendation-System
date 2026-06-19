import { motion } from "framer-motion";
import { FaBrain, FaFire, FaHome, FaInfoCircle } from "react-icons/fa";

const navItems = [
  { label: "Home", href: "#home", icon: FaHome },
  { label: "Trending", href: "#trending", icon: FaFire },
  { label: "About", href: "#about", icon: FaInfoCircle },
];

function Navbar() {
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3 text-white">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent shadow-glow">
            <FaBrain />
          </span>
          <span className="text-lg font-black tracking-wide sm:text-xl">MovieMind AI</span>
        </a>

        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                <Icon className="text-accent" />
                <span className="hidden sm:inline">{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>
    </motion.header>
  );
}

export default Navbar;
