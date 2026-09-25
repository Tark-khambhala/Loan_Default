import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AstroLogo from "./AstroLogo";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "DASHBOARD", path: "/dashboard" },
    { name: "PREDICT", path: "/predict" },
    { name: "PERFORMANCE", path: "/performance" },
    { name: "HISTORY", path: "/history" }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#F5F3EA]/90 backdrop-blur-md border-b border-[#111111]/20 px-6 lg:px-16 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center group">
          <AstroLogo size="md" color="black" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-10 font-mono text-xs font-bold tracking-widest text-[#111111]">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`transition-colors py-1 ${
                isActive(link.path)
                  ? "text-[#111111] border-b-2 border-[#111111]"
                  : "text-[#111111]/60 hover:text-[#111111]"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Link
            to="/predict"
            className="inline-block bg-[#EFFF4F] text-[#111111] font-mono font-bold text-xs uppercase tracking-widest px-6 py-2.5 rounded-full border border-[#111111] hover:bg-[#111111] hover:text-[#EFFF4F] transition-all duration-200"
          >
            MAKE A PREDICTION
          </Link>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-[#111111] border border-[#111111] rounded-full bg-[#EFFF4F]"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-[#111111]/20 flex flex-col gap-3 font-mono font-bold text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`py-2 px-4 rounded-xl ${
                isActive(link.path) ? "bg-[#111111] text-[#EFFF4F]" : "text-[#111111] hover:bg-[#111111]/5"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/predict"
            onClick={() => setMobileMenuOpen(false)}
            className="text-center bg-[#EFFF4F] text-[#111111] font-mono font-bold text-xs uppercase tracking-widest py-3 rounded-full border border-[#111111] mt-2"
          >
            MAKE A PREDICTION →
          </Link>
        </div>
      )}
    </header>
  );
}
