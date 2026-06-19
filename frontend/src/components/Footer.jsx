import { FaGithub, FaHeart } from "react-icons/fa";

function Footer() {
  return (
    <footer id="about" className="border-t border-white/10 bg-slate-950/80">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="flex items-center gap-2">
          Built By Baljeet Kumar Patel
          <FaHeart className="text-accent" />
        </p>
        <p className="flex items-center gap-2">
          <FaGithub />
          AI recommendation system
        </p>
      </div>
    </footer>
  );
}

export default Footer;
