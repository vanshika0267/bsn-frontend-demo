import { motion } from 'framer-motion';
import { FiUsers, FiBriefcase, FiAward, FiTrendingUp, FiMessageSquare, FiShield, FiArrowRight } from 'react-icons/fi';

export default function InteractiveBentoGrid() {
  const features = [
    {
      icon: FiUsers,
      category: 'NETWORK',
      title: 'Student community network',
      description: 'Discover peers, mentors and alumni in a trusted environment built specifically for academic growth.',
      preview: (
        <div className="space-y-2.5 font-mono text-[10px] bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30 backdrop-blur-sm">
          <div className="flex justify-between items-center text-on-surface-variant pb-1.5 border-b border-slate-200/30 dark:border-slate-800/30 font-bold uppercase tracking-wider text-[8px]">
            <span>Top Contributors</span>
            <span>XP Score</span>
          </div>
          <div className="flex justify-between items-center text-on-surface">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              #1 Jiya Sharma
            </span>
            <span className="font-bold text-primary">1,820</span>
          </div>
          <div className="flex justify-between items-center text-on-surface">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
              #2 Alex Rivera
            </span>
            <span className="font-bold text-primary">1,450</span>
          </div>
        </div>
      )
    },
    {
      icon: FiBriefcase,
      category: 'OPPORTUNITIES',
      title: 'Job and internship discovery',
      description: 'Discover relevant openings faster with structured listings, strong context and clearer next steps.',
      preview: (
        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-on-surface">Software Engineering Intern</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10">Active</span>
          </div>
          <p className="text-[9px] text-on-surface-variant">Stripe • Remote / San Francisco</p>
          <div className="w-full text-center text-[8px] font-mono py-1 rounded-md border border-primary/20 text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
            Apply with BSN Verified Profile
          </div>
        </div>
      )
    },
    {
      icon: FiAward,
      category: 'MENTORSHIP',
      title: 'Mentorship journeys',
      description: 'Match with seniors and professionals who can guide projects, interviews and long-term career planning.',
      preview: (
        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30 backdrop-blur-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[10px] font-bold text-on-surface">Mentorship Availability</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {["10:00 AM", "2:30 PM", "4:00 PM"].map((t) => (
              <div key={t} className="text-[8px] font-mono p-1.5 rounded-md text-center border border-slate-200/40 dark:border-slate-800/40 text-on-surface bg-white dark:bg-slate-950 transition-colors hover:border-primary/40">
                {t}
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      icon: FiTrendingUp,
      category: 'GROWTH',
      title: 'Skill and portfolio growth',
      description: 'Showcase your work, track progress and keep your academic identity strong and recruiter-ready.',
      preview: (
        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30 backdrop-blur-sm space-y-2">
          <span className="text-[8px] uppercase tracking-wider text-on-surface-variant font-mono font-bold block">Portfolio Performance</span>
          <div className="flex justify-between items-center text-[10px] text-on-surface">
            <span>Profile views this week</span>
            <span className="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-0.5">
              <span>▲</span> +24%
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-primary h-full w-[78%] rounded-full" />
          </div>
        </div>
      )
    },
    {
      icon: FiMessageSquare,
      category: 'COLLABORATION',
      title: 'Focused collaboration',
      description: 'Keep discussions, questions and team-finding aligned around real academic and project workflows.',
      preview: (
        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30 backdrop-blur-sm space-y-2">
          <span className="text-[8px] uppercase tracking-wider text-on-surface-variant font-mono font-bold block">Active Teams Recruiting</span>
          <div className="flex justify-between items-center text-[10px] text-on-surface">
            <span>Hackathon Quest</span>
            <span className="text-[9px] text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10">1 / 4 slots</span>
          </div>
        </div>
      )
    },
    {
      icon: FiShield,
      category: 'TRUST',
      title: 'Verification and trust layer',
      description: 'Reduce noise and increase confidence through verification, moderated interactions and profile authenticity.',
      preview: (
        <div className="bg-slate-50/50 dark:bg-slate-900/40 p-3.5 rounded-xl border border-slate-200/30 dark:border-slate-800/30 backdrop-blur-sm space-y-2.5">
          <span className="text-[8px] uppercase tracking-wider text-on-surface-variant font-mono font-bold block">Trust Metrics</span>
          <div className="flex items-center gap-2 text-[10px] text-on-surface">
            <span className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold text-[8px]">✓</span>
            <span>Institutional domain verified</span>
          </div>
        </div>
      )
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  return (
    <section id="features" className="py-28 md:py-36 relative z-10 scroll-mt-20">
      {/* Background soft glow elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/3 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-on-surface leading-tight tracking-tight">
              Everything students need to grow, connect and get discovered.
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed mt-4">
              BSN brings academic identity, opportunity discovery, mentorship and collaboration into one premium, easy-to-navigate experience.
            </p>
          </motion.div>
        </div>

        {/* Features 3x2 Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="group p-8 rounded-2xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/40 transition-all duration-300 hover:border-primary/30 shadow-sm hover:shadow-[0_20px_50px_rgba(37,99,235,0.06)] hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between space-y-6 glow-accent-blue relative overflow-hidden"
              >
                <div className="space-y-4 relative z-10">
                  {/* Icon & Category Header */}
                  <div className="flex items-center justify-between">
                    <div className="text-slate-800 dark:text-slate-200 p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 transition-all duration-300 group-hover:scale-110 group-hover:rotate-6 border border-slate-200/20 dark:border-slate-800/20 group-hover:border-primary/30">
                      <Icon size={22} className="transition-transform duration-300 group-hover:text-primary" />
                    </div>
                    <FiArrowRight size={14} className="text-on-surface-variant opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                  </div>

                  {/* Text details */}
                  <div className="space-y-2 text-left">
                    <span className="text-[9px] font-bold tracking-wider text-primary font-mono uppercase block">
                      {feature.category}
                    </span>
                    <h3 className="font-poppins font-bold text-base text-on-surface leading-snug group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed font-sans">
                      {feature.description}
                    </p>
                  </div>
                </div>

                {/* Real UI preview visual */}
                <div className="relative z-10 pt-2 transition-transform duration-300 group-hover:scale-[1.02]">
                  {feature.preview}
                </div>
                
                {/* Background decorative corner shine */}
                <div className="absolute -right-16 -top-16 w-32 h-32 bg-primary/3 rounded-full blur-2xl group-hover:bg-primary/8 transition-colors duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
