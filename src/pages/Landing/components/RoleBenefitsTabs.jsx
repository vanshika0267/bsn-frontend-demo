import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';

export default function RoleBenefitsTabs() {
  const [activeTab, setActiveTab] = useState('student');

  const roles = [
    {
      id: 'student',
      title: 'For Students',
      heading: 'Build a verified profile & find opportunities.',
      description: 'Create an academic resume that recruiters can trust. Sync your GitHub metrics, earn XP, find teammates, and get mentorship.',
      benefits: [
        'Verified academic portfolio linked to university email',
        'Merit-based leaderboard showing GitHub and skill metrics',
        'Find study groups and hackathon partners instantly',
        'Direct access to senior mentors and job listings'
      ],
      cta: 'Join as Student',
      to: '/signup?role=student'
    },
    {
      id: 'senior',
      title: 'For Alumni & Seniors',
      heading: 'Give back & expand your professional network.',
      description: 'Support juniors with resume reviews, share career tips, and build reputation points on campus.',
      benefits: [
        'Verified alumni identity badges (e.g. Alumni @ Stripe)',
        'Manage incoming mentorship queries with a calendar scheduler',
        'Recommend top-performing juniors for referrals',
        'Earn community leadership tags'
      ],
      cta: 'Join as Mentor',
      to: '/signup?role=senior'
    },
    {
      id: 'recruiter',
      title: 'For Recruiters',
      heading: 'Source verified student talent directly.',
      description: 'Cut down sourcing cycles. Reach pre-verified students filtered by real GitHub metrics, university verification, and leaderboard standings.',
      benefits: [
        'Direct filters for verified student profiles and academic scoreboards',
        'Access to GitHub-synced repos and project reviews',
        'Direct message portal for high-matching student profiles',
        'Publish job and internship listings seen by targeted majors'
      ],
      cta: 'Access Recruiter Portal',
      to: '/signup?role=recruiter'
    },
    {
      id: 'college',
      title: 'For Universities',
      heading: 'Empower student success and trace outcomes.',
      description: 'Coordinate student portfolios, approve verify requests, and access analytics on student placements and skills.',
      benefits: [
        'Approve student verification documents in a single click',
        'Review comprehensive college placement and academic reports',
        'Identify general curriculum skill gaps compared to industry targets',
        'Establish direct connection pipelines with recruiter partners'
      ],
      cta: 'Register Institution',
      to: '/signup?role=college'
    }
  ];

  const currentRole = roles.find((r) => r.id === activeTab);

  return (
    <div id="roles" className="py-28 md:py-36 relative z-10 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-on-surface mb-4">
            Tailored Experiences for Every Campus Member
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed max-w-2xl mx-auto">
            Select your role to learn how the BioPay Student Network (BSN) supports your specific goals.
          </p>
        </div>

        {/* Tabs Bar */}
        <div className="flex justify-center border-b border-slate-200/40 dark:border-slate-800/40 max-w-2xl mx-auto mb-16">
          <div className="flex gap-8 overflow-x-auto no-scrollbar pb-px">
            {roles.map((role) => {
              const isActive = activeTab === role.id;
              return (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`py-3 text-xs font-bold transition-colors duration-200 border-b-2 cursor-pointer relative whitespace-nowrap ${
                    isActive
                      ? 'text-primary border-primary'
                      : 'text-on-surface-variant border-transparent hover:text-on-surface'
                  }`}
                >
                  {role.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Panel */}
        <div className="p-6 sm:p-10 rounded-xl bg-transparent border border-transparent hover:border-slate-200/60 dark:hover:border-slate-800/60 transition-all duration-300 relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            >
              {/* Left Column: Text */}
              <div className="space-y-6 text-left">
                <h3 className="font-poppins font-extrabold text-xl sm:text-2xl text-on-surface leading-tight">
                  {currentRole.heading}
                </h3>
                <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
                  {currentRole.description}
                </p>

                {/* CTA */}
                <div className="pt-2">
                  <Link
                    to={currentRole.to}
                    className="px-6 py-3 rounded-md text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 border border-slate-950 dark:border-white"
                  >
                    {currentRole.cta}
                    <FiArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Benefits Checklist */}
              <div className="space-y-4 text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant font-mono">
                  Key Benefits & Capabilities
                </h4>
                <ul className="space-y-3">
                  {currentRole.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                      <span className="text-slate-400 dark:text-slate-600 font-mono select-none">—</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
