import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { FiCalendar, FiUserCheck, FiMail, FiGlobe, FiClock, FiCheckCircle } from 'react-icons/fi';

const SeniorsMentorshipTab = () => {
  const { bookedSessionsCount, setBookedSessionsCount } = useApp();

  const seniors = [
    {
      id: 1,
      name: 'Sarah Jenkins',
      role: 'Staff Engineer',
      company: 'Vercel',
      track: 'Software Engineering',
      gradYear: '2023',
      skills: ['React', 'Next.js', 'Web Performance', 'Design Systems'],
      slots: ['Mon 4:00 PM', 'Wed 2:00 PM', 'Fri 5:00 PM'],
      bio: 'Ex-Stripe. Specialist in Next.js core frameworks and React component libraries architecture.'
    },
    {
      id: 2,
      name: 'Devon Miller',
      role: 'Backend Architect',
      company: 'AWS',
      track: 'Discrete Mathematics',
      gradYear: '2022',
      skills: ['Node.js', 'Go', 'DynamoDB', 'Microservices'],
      slots: ['Tue 10:00 AM', 'Thu 11:30 AM'],
      bio: 'AWS certified solutions architect. Enthusiastic about event-driven design and serverless deployments.'
    },
    {
      id: 3,
      name: 'Amara Lopez',
      role: 'Senior Product Designer',
      company: 'Airbnb',
      track: 'Java',
      gradYear: '2024',
      skills: ['Figma Layouts', 'User Research', 'Design Operations'],
      slots: ['Wed 3:00 PM', 'Fri 10:00 AM'],
      bio: 'Passionate about simplifying complex system dashboards and layout systems.'
    }
  ];

  const [activeSenior, setActiveSenior] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleOpenBooking = (senior) => {
    setActiveSenior(senior);
    setSelectedSlot(senior.slots[0]);
    setBookingSuccess(false);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    setBookedSessionsCount(prev => prev + 1);
    setTimeout(() => {
      setIsBookingModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Intro */}
      <div>
        <h2 className="text-2xl font-bold font-poppins text-on-surface">Seniors Mentorship Connect</h2>
        <p className="text-xs text-on-surface-variant">Book 1-on-1 calls with alumni currently working at top tech firms to review portfolios, solve issues, or get career advice.</p>
      </div>

      {/* Senior Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {seniors.map((senior) => (
          <Card key={senior.id} hoverable={true} className="flex flex-col justify-between h-full bg-white text-left">
            <div className="space-y-4">
              {/* Profile Card Header */}
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-gradient-to-tr from-primary to-[#10b981] flex items-center justify-center font-extrabold text-white text-sm shadow-sm select-none">
                  {senior.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-extrabold text-on-surface leading-tight font-poppins">{senior.name}</h3>
                  <p className="text-[10px] text-on-surface-variant leading-normal">
                    {senior.role} at <span className="text-primary font-bold">{senior.company}</span>
                  </p>
                  <p className="text-[9px] text-on-surface-variant/70 font-semibold">Alumnus Class of {senior.gradYear}</p>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-on-surface-variant font-light leading-relaxed min-h-[50px]">
                {senior.bio}
              </p>

              {/* Skill chips */}
              <div className="space-y-1.5 pt-3 border-t border-outline-variant">
                <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Expertise</span>
                <div className="flex flex-wrap gap-1">
                  {senior.skills.map(skill => (
                    <span key={skill} className="text-[9px] bg-surface border border-outline-variant text-on-surface-variant px-2.5 py-0.5 rounded font-bold uppercase">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer Action */}
            <div className="border-t border-outline-variant pt-3.5 mt-5 flex justify-between items-center mt-auto">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1">
                <FiClock className="text-on-surface-variant" size={12} />
                {senior.slots.length} open slots
              </span>
              <Button variant="primary" size="sm" className="py-1" onClick={() => handleOpenBooking(senior)}>
                Book Slot
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        title={`Book mentorship with ${activeSenior?.name}`}
        size="md"
      >
        {bookingSuccess ? (
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-3">
            <div className="h-12 w-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center text-success">
              <FiCheckCircle size={24} />
            </div>
            <h4 className="text-sm font-bold text-on-surface font-poppins">Session Booked!</h4>
            <p className="text-xs text-on-surface-variant max-w-xs">Calendar invitation has been sent to your email. Check your inbox for details.</p>
          </div>
        ) : (
          <form onSubmit={handleConfirmBooking} className="space-y-4">
            <div className="bg-surface p-4 border border-outline-variant rounded-xl space-y-2 text-left">
              <p className="text-xs font-bold text-on-surface">Session Type: 1-on-1 Vetted Consultation (30 mins)</p>
              <p className="text-[10px] text-on-surface-variant leading-relaxed"> Sarah is an expert in {activeSenior?.skills.slice(0, 2).join(', ')}. Focus will be on resume evaluation, coding guides, and Q&A.</p>
            </div>

            <div className="flex flex-col space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface tracking-wide uppercase">Select Available Date & Time Slot</label>
              <div className="grid grid-cols-1 gap-2.5">
                {activeSenior?.slots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className={`p-3 text-left border rounded-xl font-bold text-xs transition-all ${
                      selectedSlot === slot 
                        ? 'bg-primary-container text-white border-primary' 
                        : 'bg-white border-outline-variant text-on-surface-variant hover:border-primary'
                    }`}
                  >
                    {slot} (GMT+5:30)
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-1.5 pt-2 text-left">
              <label htmlFor="questions" className="text-xs font-bold text-on-surface tracking-wide uppercase">What questions or topics do you want to cover? (Optional)</label>
              <textarea
                id="questions"
                rows="3"
                placeholder="e.g. How to prepare for front-end interviews at Vercel..."
                className="w-full px-4 py-2 bg-white border border-outline-variant focus:border-primary rounded-lg text-sm text-on-surface placeholder-on-surface-variant focus:outline-none transition-all font-sans"
              />
            </div>

            <div className="border-t border-outline-variant pt-4 flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsBookingModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Confirm Booking
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default SeniorsMentorshipTab;
