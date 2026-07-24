import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import InputField from '../../../components/common/InputField';
import { FiStar, FiEdit3, FiCheckCircle, FiLock, FiBookOpen, FiBriefcase } from 'react-icons/fi';

const initialPrograms = [
  {
    id: 1,
    name: 'Stripe Software Engineering Internship',
    type: 'internship',
    rating: 4.8,
    reviewsCount: 3,
    verifiedOnly: true,
    reviews: [
      {
        id: 101,
        author: 'Marcus Vance',
        role: 'Senior/Alumni',
        rating: 5,
        content: 'Unbelievable mentorship and high code quality standard. The biopay authentication project I worked on had real production impact within week 3. Sourcing pipeline was super structured.',
        date: 'June 10, 2026',
        verified: true
      },
      {
        id: 102,
        author: 'Alex Rivera',
        role: 'Student',
        rating: 4,
        content: 'Great engineering culture and standard. The interns get treated like full time developers. High learning curve but totally worth the effort.',
        date: 'May 28, 2026',
        verified: true
      }
    ]
  },
  {
    id: 2,
    name: 'Google STEP Internship Program',
    type: 'internship',
    rating: 4.7,
    reviewsCount: 2,
    verifiedOnly: true,
    reviews: [
      {
        id: 201,
        author: 'Sarah Jenkins',
        role: 'Senior/Alumni',
        rating: 5,
        content: 'STEP is a phenomenal entry point. The structural guide and matching support for return offers are best in class. Fully verified process.',
        date: 'April 15, 2026',
        verified: true
      }
    ]
  },
  {
    id: 3,
    name: 'MIT Discrete Mathematics (CS-202)',
    type: 'course',
    rating: 4.5,
    reviewsCount: 2,
    verifiedOnly: false,
    reviews: [
      {
        id: 301,
        author: 'Emily Watson',
        role: 'Student',
        rating: 4,
        content: 'Rigorous coursework but highly fundamental. The lectures are fully covered online. Make sure you practice the combinatorics cheat sheets.',
        date: 'June 01, 2026',
        verified: true
      }
    ]
  }
];

const VerifiedReviewsTab = () => {
  const { user, userRole, updateProfile } = useApp();
  const [programs, setPrograms] = useState(initialPrograms);
  const [selectedProgram, setSelectedProgram] = useState(initialPrograms[0]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  // Verification check: User must be Senior, or Student with verified college email
  const isVerifiedToReview = userRole === 'Senior/Alumni' || user.email.includes('.edu');

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!isVerifiedToReview) {
      setErrorMsg("Review lock active: You must have a verified institutional domain account to write reviews.");
      return;
    }

    const newReview = {
      id: Date.now(),
      author: user.name,
      role: userRole,
      rating,
      content,
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      verified: true
    };

    const updatedPrograms = programs.map(prog => {
      if (prog.id === selectedProgram.id) {
        const updatedReviews = [newReview, ...prog.reviews];
        const newRating = parseFloat((updatedReviews.reduce((sum, r) => sum + r.rating, 0) / updatedReviews.length).toFixed(1));
        return {
          ...prog,
          reviews: updatedReviews,
          reviewsCount: updatedReviews.length,
          rating: newRating
        };
      }
      return prog;
    });

    setPrograms(updatedPrograms);
    setSelectedProgram(updatedPrograms.find(p => p.id === selectedProgram.id));
    setContent('');
    setShowForm(false);
    setErrorMsg('');

    // Award +20 points
    updateProfile({
      impactScore: user.impactScore + 20,
      impactProgress: Math.min(100, user.impactProgress + 2)
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold font-poppins text-on-surface">Verified Sourced Reviews</h1>
        <p className="text-xs text-on-surface-variant">Read and write validated reviews for academic courses and recruiting internships. Access restricted to verified student accounts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: Program Selection List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Programs & Courses</h3>
          <div className="space-y-2">
            {programs.map(prog => {
              const isSelected = selectedProgram.id === prog.id;
              const Icon = prog.type === 'internship' ? FiBriefcase : FiBookOpen;
              
              return (
                <div
                  key={prog.id}
                  onClick={() => {
                    setSelectedProgram(prog);
                    setShowForm(false);
                    setErrorMsg('');
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#eff6ff] border-primary text-[#1e40af] shadow-sm'
                      : 'bg-white border-outline-variant hover:border-outline text-on-surface'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Icon size={16} className={isSelected ? 'text-[#1e40af]' : 'text-on-surface-variant'} />
                      <span className="text-xs font-extrabold line-clamp-1">{prog.name}</span>
                    </div>
                    {prog.verifiedOnly && (
                      <Badge variant="primary" className="text-[9px]">Verified</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-2.5 text-[10px] font-bold text-on-surface-variant">
                    <span className="flex items-center gap-0.5 text-amber-500">
                      <FiStar size={11} className="fill-current" /> {prog.rating}
                    </span>
                    <span>•</span>
                    <span>{prog.reviewsCount} Reviews</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side: Selected Program Reviews list */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="bg-white p-5 space-y-4">
            
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-outline-variant">
              <div>
                <span className="text-[10px] font-extrabold uppercase text-primary tracking-wider">{selectedProgram.type} Review Index</span>
                <h2 className="text-sm font-extrabold text-on-surface mt-0.5">{selectedProgram.name}</h2>
              </div>
              
              <Button
                onClick={() => setShowForm(!showForm)}
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
              >
                <FiEdit3 size={14} /> Write Review
              </Button>
            </div>

            {/* Write Review Form */}
            {showForm && (
              <form onSubmit={handleSubmitReview} className="p-4 bg-surface rounded-xl border border-outline-variant space-y-4 text-left">
                <h4 className="text-xs font-bold text-on-surface">Submit Verified Review</h4>
                
                {errorMsg && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-600 font-semibold flex items-center gap-2">
                    <FiLock size={15} />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
                  <span>Rating:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-base transition-colors ${
                          star <= rating ? 'text-amber-500' : 'text-outline-variant hover:text-amber-400'
                        }`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant block">Review Feedback</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Provide insights about onboarding, project impact, mentorship, or exam patterns..."
                    className="w-full h-24 p-3 border border-outline-variant rounded-lg text-xs bg-white focus:outline-none focus:border-primary font-sans leading-relaxed text-on-surface"
                    required
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    onClick={() => { setShowForm(false); setErrorMsg(''); }}
                    variant="outline"
                    size="sm"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                  >
                    Post Review (+20 pts)
                  </Button>
                </div>
              </form>
            )}

            {/* Reviews Feed */}
            <div className="space-y-4 pt-1">
              {selectedProgram.reviews.map(rev => (
                <div key={rev.id} className="p-3.5 bg-surface-container-lowest rounded-xl border border-outline-variant/60 text-left space-y-2.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-xs text-primary font-poppins">
                        {rev.author[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">{rev.author}</h4>
                        <span className="text-[9px] text-on-surface-variant font-bold">{rev.role}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <span key={i} className="text-xs">★</span>
                        ))}
                      </div>
                      <span className="text-[9px] text-on-surface-variant">{rev.date}</span>
                    </div>
                  </div>

                  <p className="text-xs text-on-surface-variant leading-relaxed font-light">
                    {rev.content}
                  </p>

                  <div className="flex items-center gap-1 text-[9px] font-bold text-green-600 bg-green-50/50 border border-green-100 rounded-lg px-2 py-1 w-max">
                    <FiCheckCircle size={10} />
                    <span>Verified Enrollment/Completion Verified</span>
                  </div>
                </div>
              ))}
            </div>

          </Card>
        </div>

      </div>
    </div>
  );
};

export default VerifiedReviewsTab;
