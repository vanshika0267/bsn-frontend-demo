import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiX, FiArrowRight, FiSun, FiMoon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '../../../context/AppContext';

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const { settings, updateSettings } = useApp();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Section tracking
      const scrollPos = window.scrollY + 120;
      const featuresEl = document.getElementById('features');
      const howItWorksEl = document.getElementById('how-it-works');
      const faqEl = document.getElementById('faq');

      if (faqEl && scrollPos >= faqEl.offsetTop) {
        setActiveSection('#faq');
      } else if (howItWorksEl && scrollPos >= howItWorksEl.offsetTop) {
        setActiveSection('#how-it-works');
      } else if (featuresEl && scrollPos >= featuresEl.offsetTop) {
        setActiveSection('#features');
      } else {
        setActiveSection('');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-7xl z-50 transition-all duration-300 rounded-2xl md:rounded-full px-6 border ${
        scrolled 
          ? 'py-2.5 shadow-[0_12px_40px_rgba(0,0,0,0.06)] bg-white/70 dark:bg-slate-950/70 border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md' 
          : 'py-4 bg-transparent border-transparent'
      }`}
    >
      <div className="mx-auto">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="flex flex-col items-start leading-none group">
                <span className="text-xs sm:text-sm font-extrabold font-sans text-slate-900 dark:text-white flex items-center gap-1 tracking-tight">
                  <span className="text-xs select-none transition-transform duration-300 group-hover:rotate-12">🎓</span>
                  BioPay Student Network
                </span>
                <span className="text-[8px] sm:text-[9px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 tracking-tight">
                  Student identity, mentoring and opportunities
                </span>
              </div>
            </Link>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-8 justify-center flex-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  className={`text-[11px] font-semibold transition-colors duration-200 relative py-1 ${
                    isActive 
                      ? 'text-primary' 
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-[-4px] left-0 right-0 h-[2px] bg-primary rounded-full shadow-[0_1px_4px_rgba(37,99,235,0.4)]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          {/* Right: CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4 flex-shrink-0">
            {/* Theme Toggle Button */}
            <button
              onClick={() => updateSettings('darkMode', !settings.darkMode)}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
            >
              {settings?.darkMode ? <FiSun size={14} className="text-amber-400" /> : <FiMoon size={14} />}
            </button>

            <Link
              to="/login"
              className="text-[11px] font-semibold text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Log in
            </Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/signup"
                className="px-5 py-2 rounded-full text-[11px] font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center gap-1.5 border border-slate-950 dark:border-white shadow-sm hover:shadow-[0_4px_20px_rgba(59,130,246,0.25)] relative group overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-1">
                  Get Started
                  <FiArrowRight size={11} className="transition-transform group-hover:translate-x-0.5" />
                </span>
                <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button & Theme Toggle */}
          <div className="md:hidden flex items-center gap-1.5">
            <button
              onClick={() => updateSettings('darkMode', !settings.darkMode)}
              className="p-1.5 hover:bg-black/5 dark:hover:bg-white/5 rounded-full text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
              title={settings.darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark mode"
            >
              {settings?.darkMode ? <FiSun size={15} className="text-amber-400" /> : <FiMoon size={15} />}
            </button>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-on-surface-variant hover:text-on-surface transition-colors focus:outline-none cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden mt-2 overflow-hidden"
          >
            <div className="pt-2 pb-4 space-y-3 px-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-xl text-xs font-semibold text-on-surface-variant hover:bg-black/5 dark:hover:bg-white/5 hover:text-on-surface transition-all"
                >
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-outline-variant/30 my-1" />
              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2 rounded-xl border border-outline-variant/60 text-xs font-bold text-on-surface hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center py-2.5 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-1 shadow-sm"
                >
                  Get Started
                  <FiArrowRight size={11} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
