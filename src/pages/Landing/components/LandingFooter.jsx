import { Link } from 'react-router-dom';
import { FiGithub, FiTwitter, FiLinkedin, FiSend } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function LandingFooter() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate submission
    alert("Thanks for subscribing!");
  };

  return (
    <footer className="border-t border-slate-200/20 dark:border-slate-800/20 bg-background relative z-10 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-12 mb-16">
          
          {/* Brand Column (takes up 2 columns) */}
          <div className="md:col-span-2 space-y-6 text-left">
            <div className="flex items-center gap-2">
              <span className="text-base select-none">🎓</span>
              <span className="font-poppins font-extrabold text-base text-on-surface tracking-tight">
                BioPay Student Network
              </span>
            </div>
            
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm font-sans">
              Build a trusted academic identity, discover meaningful opportunities and connect with a stronger student community from one focused platform.
            </p>

            {/* Social Icons */}
            <div className="flex gap-4 pt-2">
              {[
                { icon: FiGithub, href: "https://github.com" },
                { icon: FiTwitter, href: "https://twitter.com" },
                { icon: FiLinkedin, href: "https://linkedin.com" }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={idx}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200/40 dark:border-slate-800/40 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                  >
                    <Icon size={14} />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Quick Links: Platform */}
          <div className="text-left space-y-4 col-span-1">
            <h4 className="text-[10px] font-bold text-on-surface uppercase tracking-wider font-mono">
              Platform
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-on-surface-variant font-medium font-sans">
              <li>
                <a href="#features" className="hover:text-primary transition-colors">Features</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
              </li>
            </ul>
          </div>

          {/* Quick Links: Support & Access */}
          <div className="text-left space-y-4 col-span-1">
            <h4 className="text-[10px] font-bold text-on-surface uppercase tracking-wider font-mono">
              Access & Support
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-on-surface-variant font-medium font-sans">
              <li>
                <Link to="/login" className="hover:text-primary transition-colors">Sign in</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-primary transition-colors">Create account</Link>
              </li>
              <li>
                <a href="mailto:hello@biopaynet.com" className="hover:text-primary transition-colors">
                  Support Email
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Column (takes up 2 columns) */}
          <div className="md:col-span-2 text-left space-y-4">
            <h4 className="text-[10px] font-bold text-on-surface uppercase tracking-wider font-mono">
              Stay Updated
            </h4>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-sm font-sans">
              Subscribe to get latest updates about internship drives, mentorship sessions, and campus events.
            </p>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-sm">
              <input
                type="email"
                required
                placeholder="Enter email address"
                className="flex-1 px-4 py-2 text-xs sm:text-sm rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 focus:outline-none focus:border-primary transition-all font-sans"
              />
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                className="px-4 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 border border-slate-950 dark:border-white shadow-sm cursor-pointer"
              >
                <span>Subscribe</span>
                <FiSend size={11} />
              </motion.button>
            </form>
          </div>
        </div>

        {/* Glass Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200/40 dark:via-slate-800/40 to-transparent my-10" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] sm:text-xs text-slate-400 font-medium font-sans">
          <p>© 2026 BioPay Student Network. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-6 text-[9px] sm:text-[10px] uppercase tracking-wider text-on-surface-variant font-mono">
            <span>Verified profiles</span>
            <span className="hidden sm:inline">•</span>
            <span>Mentorship and opportunities</span>
            <span className="hidden sm:inline">•</span>
            <span>Built for campuses</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
