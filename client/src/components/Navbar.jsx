import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Plus, Compass, Info, Menu, X, BarChart2 } from 'lucide-react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import Button from './Button';

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClasses = ({ isActive }) =>
    `text-sm font-medium transition-colors px-3 py-1.5 rounded-lg ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30'
        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-white/[0.05]'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-[#090a0f]/80 border-b border-slate-200/80 dark:border-white/[0.08] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Logo />

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
          <NavLink to="/polls" className={navLinkClasses}>
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4" />
              Explore Polls
            </span>
          </NavLink>
          <NavLink to="/about" className={navLinkClasses}>
            <span className="flex items-center gap-1.5">
              <Info className="w-4 h-4" />
              About
            </span>
          </NavLink>
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <Link to="/create">
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              className="font-semibold shadow-indigo-500/20"
            >
              Create Poll
            </Button>
          </Link>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#0e1017]/95 backdrop-blur-xl px-4 pt-2 pb-6 space-y-3">
          <div className="flex flex-col space-y-1">
            <NavLink
              to="/polls"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4" />
                Explore Polls
              </span>
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={navLinkClasses}
            >
              <span className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                About
              </span>
            </NavLink>
          </div>
          <div className="pt-2">
            <Link to="/create" onClick={() => setMobileMenuOpen(false)}>
              <Button
                variant="primary"
                size="md"
                leftIcon={<Plus className="w-4 h-4" />}
                className="w-full justify-center"
              >
                Create Poll
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
