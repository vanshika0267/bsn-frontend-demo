import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/common/Modal';
import InputField from '../../../components/common/InputField';
import { FiBriefcase, FiMapPin, FiDollarSign, FiClock, FiFileText, FiCheckCircle } from 'react-icons/fi';

const OpportunitiesTab = () => {
  const { opportunitiesList, setOpportunitiesList } = useApp();
  const [selectedTrack, setSelectedTrack] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Application Modal state
  const [activeOpportunity, setActiveOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('Alex_Rivera_Resume.pdf');
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const tracks = ['All', 'Software Engineering', 'Discrete Mathematics', 'Applied Machine Learning'];
  const types = ['All', 'Full-time', 'Internship', 'Freelance', 'Fellowship', 'Competition', 'Hackathon'];

  // Filter opportunities
  const filtered = opportunitiesList.filter(opp => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      opp.title.toLowerCase().includes(query) ||
      (opp.company || opp.host || '').toLowerCase().includes(query) ||
      opp.tags.some(tag => tag.toLowerCase().includes(query));

    const matchesTrack = selectedTrack === 'All' || opp.track === selectedTrack;
    const matchesType = selectedType === 'All' || opp.type === selectedType;

    return matchesSearch && matchesTrack && matchesType;
  });

  const handleApplyClick = (opp) => {
    setActiveOpportunity(opp);
    setCoverLetter('');
    setAppliedSuccess(false);
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    if (!coverLetter.trim()) return;

    // Mutate state in global AppContext
    setOpportunitiesList(prev => 
      prev.map(opp => opp.id === activeOpportunity.id ? { ...opp, status: 'Applied' } : opp)
    );

    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      setActiveOpportunity(null);
    }, 1500);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Applied':
        return <Badge variant="warning">Application Submitted</Badge>;
      case 'Vetted':
      case 'Vetted/Approved':
        return <Badge variant="success">Approved & Vetted</Badge>;
      default:
        return <Badge variant="primary">Accepting Applications</Badge>;
    }
  };

  const getTrackBadgeVariant = (track) => {
    switch (track) {
      case 'Software Engineering': return 'primary';
      case 'Discrete Mathematics': return 'secondary';
      case 'Applied Machine Learning': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <h1 className="text-2xl font-bold font-poppins text-on-surface">Opportunities & Internships</h1>
        <p className="text-xs text-on-surface-variant">Sourced positions and software challenges vetted for BioPay Network students.</p>
      </div>

      {/* Search & Filters Panel */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl space-y-4 shadow-sm">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities by title, host company, or tech stack tags..."
        />

        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {/* Tracks Filter */}
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Tracks</span>
            <div className="flex flex-wrap gap-1.5">
              {tracks.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedTrack(t)}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                    selectedTrack === t 
                      ? 'bg-primary-container text-white border-primary' 
                      : 'bg-transparent hover:bg-surface-container text-on-surface-variant border-outline-variant'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Types Filter */}
          <div className="flex-1 space-y-1">
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider block">Types</span>
            <div className="flex flex-wrap gap-1.5">
              {types.map(t => (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-2.5 py-1 rounded text-xs font-bold border transition-colors ${
                    selectedType === t 
                      ? 'bg-primary-container text-white border-primary' 
                      : 'bg-transparent hover:bg-surface-container text-on-surface-variant border-outline-variant'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Listings */}
      {filtered.length === 0 ? (
        <Card className="p-8 text-center border-dashed flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3 text-lg font-bold">
            💼
          </div>
          <h3 className="text-sm font-bold text-on-surface">No opportunities match your search</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
            Try adjusting your track filters or typing different search queries.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((opp) => (
            <Card key={opp.id} hoverable={true} className="flex flex-col justify-between gap-4 bg-white text-left">
              <div className="space-y-3.5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-lg shrink-0 select-none font-bold">
                      {opp.logo || '▲'}
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-on-surface line-clamp-1">{opp.title}</h3>
                      <p className="text-xs text-on-surface-variant font-bold">{opp.company || opp.host}</p>
                    </div>
                  </div>
                  {getStatusBadge(opp.status)}
                </div>

                {/* Track Tag & Details */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-on-surface-variant">
                  <Badge variant={getTrackBadgeVariant(opp.track)}>{opp.track || 'Core Network'}</Badge>
                  <span className="flex items-center gap-1"><FiMapPin size={13} /> {opp.location}</span>
                  <span className="flex items-center gap-1"><FiDollarSign size={13} /> {opp.salary || opp.reward}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                  {opp.description}
                </p>

                {/* Tech tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {opp.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded bg-surface border border-outline-variant text-[10px] font-bold text-primary"
                    >
                      {tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Footer */}
              <div className="pt-3.5 border-t border-outline-variant flex items-center justify-between mt-auto">
                <span className="text-[10px] text-on-surface-variant/70 font-semibold flex items-center gap-1">
                  <FiClock size={12} /> Posted: {opp.posted || opp.deadline}
                </span>

                <Button
                  onClick={() => handleApplyClick(opp)}
                  disabled={opp.status === 'Applied' || opp.status === 'Vetted'}
                  variant={opp.status === 'Applied' || opp.status === 'Vetted' ? 'secondary' : 'primary'}
                  size="sm"
                >
                  {opp.status === 'Applied' ? 'Applied' : opp.status === 'Vetted' ? 'Vetted' : 'Apply Now'}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={activeOpportunity !== null}
        onClose={() => setActiveOpportunity(null)}
        title={activeOpportunity ? `Apply for ${activeOpportunity.title}` : ''}
        size="md"
      >
        {appliedSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 border border-green-200 flex items-center justify-center animate-bounce">
              <FiCheckCircle size={24} />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Application Submitted!</h3>
            <p className="text-xs text-on-surface-variant">Your vetted portfolio and resume have been forwarded to {activeOpportunity?.company || activeOpportunity?.host}.</p>
          </div>
        ) : (
          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div className="p-3.5 bg-surface rounded-lg border border-outline-variant text-left">
              <p className="text-xs font-bold text-on-surface">{activeOpportunity?.title}</p>
              <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{activeOpportunity?.company || activeOpportunity?.host} • {activeOpportunity?.location}</p>
            </div>

            {/* Resume Upload mock */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface block">Resume Attachment</label>
              <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface-container">
                <div className="flex items-center gap-2">
                  <FiFileText className="text-primary" size={18} />
                  <span className="text-xs font-semibold text-on-surface">{resumeName}</span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setResumeName(resumeName ? '' : 'Alex_Rivera_Resume.pdf')}
                  className="text-xs font-bold text-primary hover:text-primary-variant"
                >
                  {resumeName ? 'Remove' : 'Select resume'}
                </button>
              </div>
            </div>

            {/* Cover letter */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface">Cover Letter / Pitch Note</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why your credentials, projects, and hackathon experience make you a great fit for this role..."
                className="w-full h-32 p-3 border border-outline-variant rounded-lg text-sm bg-white focus:outline-none focus:border-primary font-sans"
                required
              />
            </div>

            <div className="p-3 bg-[#eff6ff] border border-primary/20 rounded-lg text-[10px] text-[#1e40af] font-medium leading-relaxed text-left">
              💡 <strong>College Vetting Advantage:</strong> Since you are applying inside the BioPay Student Network, your university verified credentials and GitHub project stars will be automatically highlighted on the recruiter dashboard.
            </div>

            {/* Submit buttons */}
            <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant">
              <Button type="button" onClick={() => setActiveOpportunity(null)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Submit Application
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default OpportunitiesTab;
