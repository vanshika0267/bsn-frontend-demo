import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { listOpportunities, applyToOpportunity } from '../../../services/api';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/common/Modal';
import { FiMapPin, FiDollarSign, FiClock, FiFileText, FiCheckCircle, FiUsers, FiAward, FiCalendar, FiRefreshCw } from 'react-icons/fi';

// Category filter tabs -> maps UI label to the API `category` value.
// `undefined` means "All" (omit the category param).
const CATEGORIES = [
  { label: 'All', value: undefined },
  { label: 'Internships', value: 'internship' },
  { label: 'Full-time', value: 'full_time' },
  { label: 'Hackathons', value: 'hackathon' },
];

const CATEGORY_LABELS = {
  internship: 'Internship',
  full_time: 'Full-time',
  hackathon: 'Hackathon',
};

const categoryBadgeVariant = (category) => {
  switch (category) {
    case 'hackathon': return 'purple';
    case 'internship': return 'primary';
    case 'full_time': return 'success';
    default: return 'default';
  }
};

const formatDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const OpportunitiesTab = () => {
  const { user } = useApp();

  const [activeCategory, setActiveCategory] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState('');

  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Per-opportunity apply tracking.
  const [appliedIds, setAppliedIds] = useState(() => new Set());

  // Application modal state.
  const [activeOpportunity, setActiveOpportunity] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeName, setResumeName] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  const loadOpportunities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listOpportunities(activeCategory);
      setOpportunities(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load opportunities.');
      setOpportunities([]);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => {
    loadOpportunities();
  }, [loadOpportunities]);

  // Client-side search over the category-filtered results.
  const filtered = opportunities.filter((opp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      (opp.title || '').toLowerCase().includes(q) ||
      (opp.company || '').toLowerCase().includes(q) ||
      (opp.department || '').toLowerCase().includes(q) ||
      (opp.location || '').toLowerCase().includes(q)
    );
  });

  const isApplied = (opp) => appliedIds.has(opp.id) || opp.status === 'Applied' || opp.status === 'applied';

  const handleApplyClick = (opp) => {
    setActiveOpportunity(opp);
    setCoverLetter('');
    setResumeFile(null);
    setResumeName('');
    setSubmitError(null);
    setAppliedSuccess(false);
  };

  const closeModal = () => {
    setActiveOpportunity(null);
    setSubmitError(null);
    setAppliedSuccess(false);
  };

  const handleApplicationSubmit = async (e) => {
    e.preventDefault();
    if (!activeOpportunity) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await applyToOpportunity(activeOpportunity.id, user?.id, resumeFile);
      setAppliedIds((prev) => {
        const next = new Set(prev);
        next.add(activeOpportunity.id);
        return next;
      });
      // Reflect the applicant count locally.
      setOpportunities((prev) =>
        prev.map((o) =>
          o.id === activeOpportunity.id
            ? { ...o, applicant_count: (o.applicant_count || 0) + 1 }
            : o
        )
      );
      setAppliedSuccess(true);
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err) {
      setSubmitError(err.message || 'Could not submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Intro */}
      <div>
        <h1 className="text-2xl font-bold font-poppins text-on-surface">Opportunities & Internships</h1>
        <p className="text-xs text-on-surface-variant">Sourced positions and software challenges vetted for BioPay Network students.</p>
      </div>

      {/* Search & Category Tabs Panel */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl space-y-4 shadow-sm">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search opportunities by title, company, department, or location..."
        />

        <div className="flex flex-wrap gap-1.5 pt-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3 py-1.5 rounded text-xs font-bold border transition-colors ${
                activeCategory === cat.value
                  ? 'bg-primary-container text-white border-primary'
                  : 'bg-transparent hover:bg-surface-container text-on-surface-variant border-outline-variant'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* States: loading / error / empty / grid */}
      {loading ? (
        <Card className="p-10 text-center border-dashed flex flex-col items-center justify-center gap-3">
          <FiRefreshCw className="animate-spin text-primary" size={22} />
          <p className="text-sm font-bold text-on-surface">Loading opportunities…</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-dashed flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-error/10 text-error flex items-center justify-center text-lg font-bold">!</div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">Couldn't load opportunities</h3>
            <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">{error}</p>
          </div>
          <Button onClick={loadOpportunities} variant="primary" size="sm">Try again</Button>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="p-8 text-center border-dashed flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3 text-lg font-bold">
            💼
          </div>
          <h3 className="text-sm font-bold text-on-surface">No opportunities found</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
            Try a different category or adjust your search query.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((opp) => {
            const applied = isApplied(opp);
            const isHackathon = opp.category === 'hackathon';
            return (
              <Card key={opp.id} hoverable={true} className="flex flex-col justify-between gap-4 bg-white text-left">
                <div className="space-y-3.5">
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2.5">
                      <div className="w-10 h-10 rounded-lg bg-surface-container border border-outline-variant flex items-center justify-center text-lg shrink-0 select-none font-bold">
                        {isHackathon ? '🏆' : '▲'}
                      </div>
                      <div>
                        <h3 className="text-sm font-extrabold text-on-surface line-clamp-1">{opp.title}</h3>
                        <p className="text-xs text-on-surface-variant font-bold">{opp.company}</p>
                      </div>
                    </div>
                    <Badge variant={categoryBadgeVariant(opp.category)}>
                      {CATEGORY_LABELS[opp.category] || opp.category || 'Opportunity'}
                    </Badge>
                  </div>

                  {/* Details */}
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-on-surface-variant">
                    {opp.department && (
                      <span className="flex items-center gap-1"><FiFileText size={13} /> {opp.department}</span>
                    )}
                    {opp.location && (
                      <span className="flex items-center gap-1"><FiMapPin size={13} /> {opp.location}</span>
                    )}
                    {isHackathon ? (
                      opp.prize && (
                        <span className="flex items-center gap-1"><FiAward size={13} /> {opp.prize}</span>
                      )
                    ) : (
                      opp.stipend && (
                        <span className="flex items-center gap-1"><FiDollarSign size={13} /> {opp.stipend}</span>
                      )
                    )}
                    <span className="flex items-center gap-1"><FiUsers size={13} /> {opp.applicant_count || 0} applicants</span>
                  </div>

                  {/* Hackathon extras: dates + team size */}
                  {isHackathon && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-on-surface-variant">
                      {(opp.starts_at || opp.ends_at) && (
                        <span className="flex items-center gap-1">
                          <FiCalendar size={13} />
                          {formatDate(opp.starts_at) || '?'}{opp.ends_at ? ` – ${formatDate(opp.ends_at)}` : ''}
                        </span>
                      )}
                      {opp.team_size && (
                        <span className="flex items-center gap-1"><FiUsers size={13} /> Team of {opp.team_size}</span>
                      )}
                    </div>
                  )}

                  {/* Description */}
                  {opp.description && (
                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">
                      {opp.description}
                    </p>
                  )}
                </div>

                {/* Action Footer */}
                <div className="pt-3.5 border-t border-outline-variant flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-on-surface-variant/70 font-semibold flex items-center gap-1">
                    <FiClock size={12} /> Posted: {formatDate(opp.created_at) || '—'}
                  </span>

                  <Button
                    onClick={() => handleApplyClick(opp)}
                    disabled={applied}
                    variant={applied ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    {applied ? 'Applied' : 'Apply Now'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Apply Modal */}
      <Modal
        isOpen={activeOpportunity !== null}
        onClose={closeModal}
        title={activeOpportunity ? `Apply for ${activeOpportunity.title}` : ''}
        size="md"
      >
        {appliedSuccess ? (
          <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 border border-green-200 flex items-center justify-center animate-bounce">
              <FiCheckCircle size={24} />
            </div>
            <h3 className="text-sm font-bold text-on-surface">Application Submitted!</h3>
            <p className="text-xs text-on-surface-variant">Your vetted portfolio and resume have been forwarded to {activeOpportunity?.company}.</p>
          </div>
        ) : (
          <form onSubmit={handleApplicationSubmit} className="space-y-4">
            <div className="p-3.5 bg-surface rounded-lg border border-outline-variant text-left">
              <p className="text-xs font-bold text-on-surface">{activeOpportunity?.title}</p>
              <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">
                {activeOpportunity?.company}{activeOpportunity?.location ? ` • ${activeOpportunity.location}` : ''}
              </p>
            </div>

            {/* Resume / CV upload */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface block">Resume / CV (PDF)</label>
              <div className="flex items-center justify-between p-3 border border-outline-variant rounded-lg bg-surface-container">
                <div className="flex items-center gap-2 min-w-0">
                  <FiFileText className="text-primary shrink-0" size={18} />
                  <span className="text-xs font-semibold text-on-surface truncate">
                    {resumeName || 'No file selected'}
                  </span>
                </div>
                <label className="text-xs font-bold text-primary hover:text-primary-variant cursor-pointer shrink-0">
                  {resumeName ? 'Change' : 'Select file'}
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files && e.target.files[0];
                      setResumeFile(f || null);
                      setResumeName(f ? f.name : '');
                    }}
                  />
                </label>
              </div>
              <p className="text-[10px] text-on-surface-variant">Optional, but recruiters see and download it.</p>
            </div>

            {/* Cover letter (optional) */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface">Cover Letter / Pitch Note</label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why your credentials, projects, and hackathon experience make you a great fit..."
                className="w-full h-32 p-3 border border-outline-variant rounded-lg text-sm bg-white focus:outline-none focus:border-primary font-sans"
              />
            </div>

            <div className="p-3 bg-[#eff6ff] border border-primary/20 rounded-lg text-[10px] text-[#1e40af] font-medium leading-relaxed text-left">
              💡 <strong>College Vetting Advantage:</strong> Applying inside the BioPay Student Network highlights your university-verified credentials on the recruiter dashboard.
            </div>

            {submitError && (
              <div className="p-3 bg-error/10 border border-error/30 rounded-lg text-[11px] text-error font-semibold text-left">
                {submitError}
              </div>
            )}

            {/* Submit buttons */}
            <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant">
              <Button type="button" onClick={closeModal} variant="outline" size="sm" disabled={submitting}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Application'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};

export default OpportunitiesTab;
