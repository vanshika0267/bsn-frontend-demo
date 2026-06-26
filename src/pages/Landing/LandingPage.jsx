import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiActivity, FiBriefcase, FiUsers, FiBookOpen, FiAward } from 'react-icons/fi';
import Button from '../../components/common/Button';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FiBookOpen,
      title: "Academic Identity",
      description: "A centralized home for your grades, verified skills, and academic uploads. Replaces traditional scattered PDFs."
    },
    {
      icon: FiAward,
      title: "Impact Ranking",
      description: "Grow your Impact Score by contributing study notes and coding resources. Stand out on the leaderboard."
    },
    {
      icon: FiBriefcase,
      title: "Opportunities Arena",
      description: "Direct application to hackathons, internships, fellowships, and challenges. Fully integrated profiles mean no double entries."
    },
    {
      icon: FiUsers,
      title: "Alumni & Peer Team Finder",
      description: "Find co-founders for startup projects or developers for national hackathons with filters by skills and college."
    }
  ];

  const stats = [
    { value: "45,000+", label: "Active Students" },
    { value: "320+", label: "Verified Universities" },
    { value: "85,000+", label: "Resources Shared" },
    { value: "1,200+", label: "Hackathons Listed" }
  ];

  const testimonials = [
    {
      quote: "BSN completely transformed how I search for hackathon teammates. We found our frontend dev in 10 minutes and went on to win 1st place!",
      author: "Sarah Connor",
      college: "Stanford University",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100&h=100"
    },
    {
      quote: "Being able to see verified skill badges alongside a student's GitHub repo and university uploads cuts our internship sourcing time by 60%.",
      author: "David Vance",
      college: "Senior Recruiter, Stripe",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100"
    }
  ];

  return (
    <div className="min-h-screen bg-surface text-on-surface font-sans overflow-x-hidden">
      {/* Sticky White Navbar */}
      <nav className="sticky top-0 z-50 w-full bg-white border-b border-outline-variant px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary-container flex items-center justify-center shadow-lg shadow-primary/20">
            <span className="font-poppins font-extrabold text-white text-lg tracking-wider">B</span>
          </div>
          <span className="font-poppins font-bold text-xl tracking-tight text-on-surface">
            BSN <span className="text-primary text-xs font-semibold px-1.5 py-0.5 rounded bg-primary/10 ml-1">STUDENT</span>
          </span>
        </Link>
        
        {/* Nav Anchors */}
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-on-surface-variant">
          <a href="#features" className="hover:text-on-surface transition-colors">Features</a>
          <a href="#stats" className="hover:text-on-surface transition-colors">Impact</a>
          <a href="#testimonials" className="hover:text-on-surface transition-colors">Reviews</a>
        </div>

        {/* Auth CTAs */}
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-bold text-on-surface-variant hover:text-on-surface px-3 py-2 transition-colors">
            Login
          </Link>
          <Button onClick={() => navigate('/signup')} variant="primary" size="sm">
            Register
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 px-6 max-w-7xl mx-auto flex flex-col items-center justify-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 max-w-3xl"
        >
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider bg-[#eff6ff] text-[#1e40af] border border-[#bfdbfe]">
            <FiActivity size={12} /> The New Academic Standard
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-poppins text-on-surface leading-tight">
            Build Your <span className="text-primary">Academic Identity</span>. Showcase Skills. Discover Opportunities.
          </h1>
          <p className="text-base sm:text-lg text-on-surface-variant leading-relaxed max-w-2xl mx-auto font-light">
            An ecosystem combining professional networking, academic resources sharing, developer portfolio templates, and real opportunities. Dedicated to the Student Experience.
          </p>
        </motion.div>

        {/* Call to Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center gap-3.5 mt-4"
        >
          <Button onClick={() => navigate('/signup')} variant="primary" size="lg" className="w-full sm:w-auto gap-2">
            Get Started Now <FiArrowRight size={16} />
          </Button>
          <Button onClick={() => navigate('/dashboard')} variant="secondary" size="lg" className="w-full sm:w-auto">
            Explore Platform
          </Button>
        </motion.div>

        {/* Dashboard Mockup Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-full max-w-5xl rounded-xl border border-outline-variant bg-white p-3 mt-12 shadow-xl relative"
        >
          <img 
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000&h=450" 
            alt="Dashboard mockup display" 
            className="w-full rounded-lg object-cover border border-outline-variant filter brightness-95 shadow-lg"
          />
        </motion.div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto border-t border-outline-variant">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-on-surface">Fully Loaded Ecosystem</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Engineered to highlight true student potential beyond standard dry text resumes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6.5">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <motion.div
                whileHover={{ y: -2 }}
                key={idx}
                className="bg-white p-6 sm:p-8 rounded-xl border border-outline-variant flex gap-5 items-start transition-all duration-300 hover:border-outline shadow-sm hover:shadow-md"
              >
                <div className="p-3.5 rounded-lg bg-surface-container text-primary shrink-0 shadow-inner">
                  <Icon size={22} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold font-poppins text-on-surface">{feature.title}</h3>
                  <p className="text-sm text-on-surface-variant leading-relaxed font-light">{feature.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Statistics Section */}
      <section id="stats" className="py-16 bg-white border-y border-outline-variant px-6 text-center">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="space-y-1">
              <span className="text-3xl sm:text-4xl font-extrabold font-poppins text-primary">{stat.value}</span>
              <p className="text-xs text-on-surface-variant uppercase font-bold tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold font-poppins text-on-surface">Loved by Students & Recruiters</h2>
          <p className="text-sm text-on-surface-variant leading-relaxed">
            Real peer feedback showing how academic profiles accelerate opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((item, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-xl border border-outline-variant flex flex-col justify-between gap-6 relative shadow-sm hover:shadow-md">
              <p className="text-sm text-on-surface italic leading-relaxed">
                "{item.quote}"
              </p>
              <div className="flex items-center gap-3">
                <img 
                  src={item.avatar} 
                  alt={item.author} 
                  className="w-10 h-10 rounded-lg object-cover ring-2 ring-outline-variant"
                />
                <div>
                  <h4 className="text-xs font-bold text-on-surface">{item.author}</h4>
                  <p className="text-[10px] text-on-surface-variant font-medium">{item.college}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Banner Card */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="relative rounded-2xl bg-primary-container text-white overflow-hidden p-8 sm:p-12 text-center flex flex-col items-center justify-center gap-6 shadow-xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-poppins relative z-10 text-white">
            Ready to Build Your Digital Identity?
          </h2>
          <p className="text-xs sm:text-sm text-white/80 max-w-md relative z-10 leading-relaxed">
            Claim your student profile, upload your resources, connect with top alumni and apply to premium roles. Absolutely free for students.
          </p>
          <button 
            onClick={() => navigate('/signup')} 
            className="relative z-10 mt-2 px-8.5 py-3 rounded-lg bg-white text-primary hover:bg-surface-container font-semibold transition-colors duration-200"
          >
            Register Now
          </button>
        </div>
      </section>

      {/* Site Footer */}
      <footer className="bg-white border-t border-outline-variant py-10 px-6 text-center text-xs text-on-surface-variant font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-poppins">B</div>
            <span className="font-bold text-on-surface">BSN Student Network</span>
          </div>
          <p>© {new Date().getFullYear()} BSN. Built for student academic and professional networking.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
