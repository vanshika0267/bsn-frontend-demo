import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

export default function FAQSection() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: 'Is BSN really free for students?',
      answer: 'Yes, BSN is 100% free for students. We sync with your academic email to unlock access to student portfolios, team quests, and resource hubs.',
    },
    {
      question: 'How does profile verification work?',
      answer: 'Students can verify through their college email and related identity checks so recruiters, mentors and peers can trust who they are interacting with.',
    },
    {
      question: 'Can students connect across different colleges?',
      answer: 'Yes! BSN is a cross-campus network, allowing students from different colleges to form teams, share study resources, and collaborate.',
    },
    {
      question: 'What if I do not have a college email right now?',
      answer: 'You can sign up with a standard email, but full verified capabilities (like public recruiter portfolios and school groups) require student domain verification.',
    },
    {
      question: 'How does mentorship matching help?',
      answer: 'It matches you with verified alumni and seniors working in tech, helping you book direct resume feedback and project mentorship sessions.',
    },
    {
      question: 'Is user data protected?',
      answer: 'Absolutely. We use secure database encryption and give you complete control over what information you choose to make public or share with recruiters.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <section id="faq" className="py-28 md:py-36 relative z-10 scroll-mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-poppins font-extrabold text-3xl sm:text-4xl text-on-surface leading-tight tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed mt-4 font-sans">
              Learn how verification, mentorship, access and privacy work before you create your profile.
            </p>
          </motion.div>
        </div>

        {/* Accordions */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="space-y-4"
        >
          {faqs.map((faq, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden bg-white/40 dark:bg-slate-900/10 backdrop-blur-md ${
                  isOpen 
                    ? 'border-primary/40 bg-white/60 dark:bg-slate-900/20 shadow-md shadow-primary/5' 
                    : 'border-slate-200/50 dark:border-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Header/Question Trigger */}
                <button
                  onClick={() => setActiveIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-poppins font-bold text-xs sm:text-sm text-on-surface hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors cursor-pointer"
                >
                  <span className="font-semibold leading-normal">{faq.question}</span>
                  <motion.div 
                    animate={{ rotate: isOpen ? 90 : 0 }}
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                    className="text-on-surface-variant ml-4 p-1 rounded-full bg-slate-100/50 dark:bg-slate-800/50"
                  >
                    {isOpen ? <FiMinus size={14} className="text-primary" /> : <FiPlus size={14} />}
                  </motion.div>
                </button>

                {/* Answer Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-xs sm:text-sm text-on-surface-variant border-t border-slate-100 dark:border-slate-800/40 leading-relaxed font-sans">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom Callout Panel */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 p-8 rounded-2xl text-center space-y-4 border border-slate-200/50 dark:border-slate-800/40 relative overflow-hidden bg-white/20 dark:bg-slate-900/5 backdrop-blur-md"
        >
          <h3 className="font-poppins font-bold text-sm sm:text-base text-on-surface">
            Still have questions?
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto leading-relaxed font-sans">
            Our team can help with onboarding, verification and understanding the right path for your profile.
          </p>
          <div className="pt-2">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              href="mailto:connectbiopay@gmail.com"
              className="px-6 py-2.5 rounded-full text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5 border border-slate-950 dark:border-white shadow-sm hover:shadow-[0_4px_15px_rgba(59,130,246,0.15)] cursor-pointer"
            >
              Contact support
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
