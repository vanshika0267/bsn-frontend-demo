import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import {
  FiArrowRight,
  FiCheck,
  FiGithub,
  FiUsers,
  FiBriefcase,
  FiAward,
  FiTrendingUp,
  FiMessageSquare,
  FiShield,
  FiStar,
  FiCalendar,
  FiMapPin,
  FiGrid
} from 'react-icons/fi';
import LandingNavbar from './components/LandingNavbar';
import LandingFooter from './components/LandingFooter';
import InteractiveBentoGrid from './components/InteractiveBentoGrid';
import FAQSection from './components/FAQSection';
import RoleBenefitsTabs from './components/RoleBenefitsTabs';

// Scroll-triggered counter helper
function StatCounter({ value, duration = 1.5 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = parseInt(value.replace(/[^0-9]/g, ''));
    if (start === end) return;

    const totalDuration = duration * 1000;
    const steps = 30;
    const stepTime = totalDuration / steps;
    const increment = end / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  const suffix = value.replace(/[0-9]/g, '');
  return <span ref={ref}>{count}{suffix}</span>;
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans overflow-x-hidden selection:bg-primary/20 bg-grid-pattern relative bg-noise">

      {/* Background Soft Blurred Blobs */}
      <div className="absolute top-[10vh] left-[-10vw] w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-primary/10 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute top-[40vh] right-[-10vw] w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-blue-500/10 rounded-full blur-[110px] sm:blur-[140px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-[20vh] left-1/4 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-indigo-500/5 rounded-full blur-[100px] sm:blur-[130px] pointer-events-none z-0 animate-pulse-glow" />

      {/* Navbar */}
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative min-h-[95vh] lg:min-h-screen flex items-center pt-32 pb-20 overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full">

            {/* Left: Headline & Call To Actions */}
            <div className="lg:col-span-6 flex flex-col items-start text-left space-y-8 max-w-[640px]">

              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-emerald-500 dark:text-emerald-400 text-xs font-bold tracking-widest font-mono uppercase"
              >
                Built for campus-verified careers
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif text-[42px] sm:text-[56px] lg:text-[68px] xl:text-[72px] text-slate-900 dark:text-white tracking-[-0.02em] leading-[1.08] font-normal"
              >
                Your portfolio, teams,<br />
                and senior guides.<br />
                <span className="bg-gradient-to-r from-[#10B981] to-[#34D399] bg-clip-text text-transparent block mt-2">
                  Unified in BSN.
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-[15px] sm:text-[18px] text-on-surface-variant font-medium leading-[1.6] max-w-[540px] font-sans"
              >
                Build a trusted academic profile, collaborate on projects, sync metrics, and connect with senior guides—all in one place.
              </motion.p>

              {/* Call to Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
              >
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                  <Link
                    to="/signup"
                    className="w-full sm:w-auto h-[56px] px-[32px] rounded-full text-xs sm:text-sm font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white transition-all flex items-center justify-center gap-2 border border-transparent shadow-[0_4px_25px_rgba(37,99,235,0.25)] relative overflow-hidden group cursor-pointer"
                  >
                    Get Started for Free
                    <FiArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </motion.div>
                <motion.a
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  href="#how-it-works"
                  className="w-full sm:w-auto h-[56px] px-[32px] rounded-full text-xs sm:text-sm font-semibold bg-white/40 dark:bg-slate-900/40 border border-[#E2E8F0] dark:border-slate-800 text-on-surface hover:bg-slate-100/50 dark:hover:bg-slate-900/65 backdrop-blur-sm transition-all flex items-center justify-center cursor-pointer"
                >
                  Explore Platform
                </motion.a>
              </motion.div>
            </div>

            {/* Right: Dashboard Illustration Mockup */}
            <div className="lg:col-span-6 w-full flex items-center justify-center relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="relative w-full max-w-[550px] min-h-[500px] flex items-center justify-center z-10"
              >

                {/* Premium Dashboard UI Mockup */}
                <div className="w-full bg-white/55 dark:bg-slate-950/45 backdrop-blur-md rounded-2xl border border-slate-200/50 dark:border-slate-850/50 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] space-y-4 relative overflow-hidden">

                  {/* Top Bar Mockup */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/30 dark:border-slate-800/40">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400/80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/80" />
                    </div>
                    <div className="text-[9px] font-mono text-on-surface-variant bg-slate-100/50 dark:bg-slate-900 px-3 py-0.5 rounded-md border border-slate-200/20 dark:border-slate-800/20">
                      bsn.app/alex-rivera
                    </div>
                    <div className="w-6" />
                  </div>

                  {/* Dashboard Content Grid */}
                  <div className="grid grid-cols-12 gap-3.5 text-left">

                    {/* Left Grid Content */}
                    <div className="col-span-12 sm:col-span-5 space-y-3">
                      {/* Profile Widget */}
                      <div className="bg-white/90 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/40">
                        <div className="relative w-10 h-10 rounded-lg bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center font-bold text-white text-xs select-none">
                          AR
                          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 border border-white dark:border-slate-900 text-[6px] font-bold">✓</span>
                        </div>
                        <div className="mt-2.5">
                          <h4 className="text-[11px] font-extrabold text-on-surface flex items-center gap-1">Alex Rivera</h4>
                          <p className="text-[8px] text-on-surface-variant font-mono">BSN lvl 4 • MIT Student</p>
                        </div>
                      </div>

                      {/* Portfolio Completion Gauge */}
                      <div className="bg-white/90 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/40 space-y-2">
                        <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Portfolio Status</span>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-on-surface">92% Done</span>
                          <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-r-primary flex items-center justify-center text-[7px] font-mono text-primary font-bold">92%</div>
                        </div>
                      </div>

                      {/* Skill Index */}
                      <div className="bg-white/90 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/40 space-y-2">
                        <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Skill Index</span>
                        <div className="space-y-1.5">
                          <div>
                            <div className="flex justify-between text-[8px] text-on-surface font-semibold mb-0.5">
                              <span>React / Next.js</span>
                              <span>85%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-primary h-full w-[85%]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex justify-between text-[8px] text-on-surface font-semibold mb-0.5">
                              <span>UI Architecture</span>
                              <span>75%</span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden">
                              <div className="bg-primary h-full w-[75%]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Grid Content */}
                    <div className="col-span-12 sm:col-span-7 space-y-3">
                      {/* Opportunities Internship Card */}
                      <div className="bg-white/90 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/40 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[7px] font-bold text-white px-2 py-0.5 bg-primary rounded-full">RECOMMENDED</span>
                          <span className="text-[8px] font-bold text-emerald-500 font-mono">98% match</span>
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-[10px] font-bold text-on-surface">Software Engineering Intern</h4>
                          <p className="text-[9px] text-on-surface-variant">Stripe • Remote / San Francisco</p>
                        </div>
                      </div>

                      {/* Community Feed / Team Finder Widget */}
                      <div className="bg-white/90 dark:bg-slate-900/80 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/40 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[8px] font-bold text-on-surface-variant uppercase tracking-wider font-mono">Team Finder</span>
                          <span className="text-[8px] text-primary font-bold">Recruiting</span>
                        </div>
                        <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200/10 dark:border-slate-800/20">
                          <p className="text-[9px] text-on-surface leading-snug font-medium">Looking for full-stack developers for Hackathon quest.</p>
                          <div className="flex justify-between items-center mt-2 text-[8px]">
                            <span className="text-on-surface-variant font-mono">2 slots remaining</span>
                            <span className="text-primary font-bold">Apply →</span>
                          </div>
                        </div>
                      </div>

                      {/* Mentor Chat/Card */}
                      <div className="bg-white/90 dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200/30 dark:border-slate-800/40 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-[8px]">JS</div>
                          <div className="leading-tight">
                            <h5 className="text-[9px] font-bold text-on-surface">Mentor Session</h5>
                            <p className="text-[7px] text-on-surface-variant">with Jiya Sharma (Stripe)</p>
                          </div>
                        </div>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-primary/10 text-primary">10:00 AM</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Widgets */}
                {/* 1. Verified Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -left-6 z-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 select-none"
                >
                  <span className="w-3 h-3 rounded-full bg-emerald-500 flex items-center justify-center text-[7px] text-white font-bold">✓</span>
                  <span className="text-[9px] font-bold text-on-surface font-mono">Institutional Verified</span>
                </motion.div>

                {/* 2. Internship Notification */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                  className="absolute top-1/4 -right-12 z-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-3 rounded-xl shadow-lg text-left max-w-[170px] space-y-1"
                >
                  <div className="flex items-center justify-between text-[7px] font-mono">
                    <span className="font-bold text-primary uppercase">Offer</span>
                    <span className="text-on-surface-variant">1h ago</span>
                  </div>
                  <p className="text-[9px] font-bold text-on-surface leading-tight font-sans">Internship Offered: Frontend Dev at Stripe</p>
                </motion.div>

                {/* 3. Mentor Message */}
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                  className="absolute -bottom-6 -right-2 z-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-3 rounded-xl shadow-lg text-left max-w-[180px] flex items-start gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center font-extrabold text-[8px] mt-0.5">JS</div>
                  <div className="space-y-0.5">
                    <h6 className="text-[8px] font-bold text-on-surface">Jiya Sharma (Mentor)</h6>
                    <p className="text-[8px] text-on-surface-variant leading-snug font-sans">Let\'s hop on a call to review your portfolio projects!</p>
                  </div>
                </motion.div>

                {/* 4. GitHub Stats */}
                <motion.div
                  animate={{ y: [0, 5, 0] }}
                  transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                  className="absolute bottom-10 -left-12 z-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-2.5 rounded-xl shadow-lg text-left space-y-1.5"
                >
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-on-surface font-mono">
                    <FiGithub className="text-primary" />
                    <span>GitHub Synchronized</span>
                  </div>
                  <div className="flex gap-4 text-left">
                    <div>
                      <span className="text-[10px] font-extrabold text-on-surface block">250+</span>
                      <span className="text-[7px] text-on-surface-variant font-mono uppercase">Commits</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold text-on-surface block">12</span>
                      <span className="text-[7px] text-on-surface-variant font-mono uppercase">Projects</span>
                    </div>
                  </div>
                </motion.div>

              </motion.div>
            </div>

          </div>
        </div>

        {/* Scroll indicator at bottom */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-10 pointer-events-none">
          <span className="text-[9px] font-bold tracking-widest text-on-surface-variant uppercase font-mono">Scroll Down</span>
          <div className="w-5 h-8 rounded-full border-2 border-on-surface-variant/30 flex justify-center p-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary scroll-indicator-wheel" />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-28 md:py-36 border-b border-slate-200/20 dark:border-slate-800/20 relative z-10 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">

          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-on-surface leading-tight tracking-tight">
              From profile creation to career momentum in five clear steps.
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-sans">
              Start quickly, build trust, discover opportunities and collaborate with peers under senior guidance.
            </p>
          </div>

          {/* Connected Timeline */}
          <div className="max-w-2xl mx-auto relative pl-6 sm:pl-10 text-left">
            {/* Timeline Vertical Path Line */}
            <div className="absolute left-[15px] sm:left-[21px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-blue-500/50 to-transparent" />

            <div className="space-y-12">
              {[
                {
                  step: 'Step 1',
                  title: 'Create Profile',
                  description: 'Set up a polished academic identity with your skills, interests and goals. Silently detects your role for a tailored onboarding experience.'
                },
                {
                  step: 'Step 2',
                  title: 'Verify Identity',
                  description: 'Connect your institutional college email to build a trust badge. Instantly verify credentials seen by mentors, peers, and recruiters.'
                },
                {
                  step: 'Step 3',
                  title: 'Find Opportunities',
                  description: 'Browse internships, projects, resources and tech listings with low friction, high signal opportunity cards, and targeted major metrics.'
                },
                {
                  step: 'Step 4',
                  title: 'Build Portfolio',
                  description: 'Sync your GitHub commits and sync portfolio performance metrics to keep your verified engineering progress visible.'
                },
                {
                  step: 'Step 5',
                  title: 'Connect with Mentors',
                  description: 'Reach senior student guides and campus alumni for direct resume feedback, project reviews, and referral advice.'
                }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className="flex gap-6 items-start relative group"
                >
                  {/* Timeline Dot Indicator */}
                  <div className="w-8 h-8 rounded-full border border-primary bg-background dark:bg-slate-950 flex items-center justify-center z-10 shadow-md group-hover:scale-115 transition-transform duration-300">
                    <span className="text-[10px] font-extrabold text-primary font-mono">{idx + 1}</span>
                  </div>

                  {/* Content details */}
                  <div className="space-y-1.5 pt-0.5 flex-1 bg-white/30 dark:bg-slate-900/10 hover:bg-white/50 dark:hover:bg-slate-900/35 border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800/40 p-4 rounded-xl transition-all duration-300 backdrop-blur-sm">
                    <span className="text-[9px] font-bold text-primary font-mono uppercase tracking-wider block">
                      {step.step}
                    </span>
                    <h3 className="font-poppins font-bold text-base text-on-surface">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans font-normal">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Role Benefits Section */}
      <RoleBenefitsTabs />

      {/* Bento Grid Features */}
      <InteractiveBentoGrid />

      {/* STUDENT JOURNEY SECTION */}
      <section className="py-28 md:py-36 border-b border-slate-200/20 dark:border-slate-800/20 relative z-10 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-on-surface leading-tight tracking-tight">
              The BSN Student Journey Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed font-sans">
              Trace how institutional verification and active collaboration drive your career momentum from Day 1.
            </p>
          </div>

          {/* Journey Path */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">
            {[
              { title: "Freshman Launch", desc: "Create your profile with college email domain and setup your interests.", idx: "1" },
              { title: "Build Skills", desc: "Complete learning track modules, synchronize repositories, and earn XP.", idx: "2" },
              { title: "Join Team Quests", desc: "Partner with study groups or hackathon peers via BSN Team Finder.", idx: "3" },
              { title: "Portfolio Sync", desc: "Auto-sync commits and metrics to build a recruiter-vetted portfolio page.", idx: "4" },
              { title: "Land Internship", desc: "Apply directly to verified internship listings using your verified identity.", idx: "5" },
              { title: "Guide / Mentorship", desc: "Give back to campus peers, review resumes, and manage schedules.", idx: "6" },
              { title: "Alumni Status", desc: "Unlock alumni status badges (e.g. Alumni @ Stripe) to support juniors.", idx: "7" },
              { title: "Career Placement", desc: "Get discovered by recruiters sorting by verified GitHub XP scores.", idx: "8" }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-white/40 dark:bg-slate-900/10 backdrop-blur-md border border-slate-200/40 dark:border-slate-800/40 hover:border-primary/20 hover:shadow-md hover:shadow-primary/5 transition-all duration-300 relative group flex flex-col justify-between min-h-[140px]"
              >
                <div className="space-y-2">
                  <h4 className="text-xs sm:text-sm font-bold text-on-surface group-hover:text-primary transition-colors">
                    {step.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-on-surface-variant font-sans leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="text-[18px] font-extrabold font-mono text-slate-250 dark:text-slate-800 mt-2 block select-none">
                  #{step.idx}
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>
      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA Section */}
      <section className="relative py-28 md:py-36 border-t border-slate-200/20 dark:border-slate-800/20 text-center overflow-hidden bg-background">
        <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h2 className="font-sora font-extrabold text-3xl sm:text-5xl text-on-surface leading-tight">
              Ready to build your student profile?
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed font-sans font-medium">
              Consolidate your academic identity, repository syncs, project team finding, and alumni booking schedulers inside one unified, premium campus database.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-3.5 pt-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/signup"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold bg-[#2563EB] hover:bg-[#1D4ED8] text-white flex items-center justify-center gap-1.5 border border-transparent shadow-[0_4px_20px_rgba(37,99,235,0.2)] cursor-pointer"
              >
                Get Started
                <FiArrowRight size={13} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link
                to="/login"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full text-xs font-bold bg-transparent border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors text-center text-on-surface cursor-pointer"
              >
                Access Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <LandingFooter />
    </div>
  );
}
