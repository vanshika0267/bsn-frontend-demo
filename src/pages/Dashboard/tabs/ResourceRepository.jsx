import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import InputField from '../../../components/common/InputField';
import EmptyState from '../../../components/common/EmptyState';
import {
  listResources,
  upvoteResource,
  downloadResource,
  listResourceRequests,
  createResourceRequest,
  upvoteResourceRequest,
} from '../../../services/api';
import {
  FiHeart,
  FiExternalLink,
  FiPlus,
  FiDownload,
  FiFileText,
  FiVideo,
  FiGithub,
  FiLink,
  FiShare2,
  FiCheckCircle,
  FiCopy,
  FiAlertCircle,
  FiLoader,
  FiInbox,
  FiHelpCircle,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ResourceRepository = () => {
  const { user } = useApp();
  const navigate = useNavigate();

  // ---- Browse resources state ----
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('upvotes'); // upvotes, downloads, date, title

  // ---- Share (QR) modal ----
  const [sharingResource, setSharingResource] = useState(null);
  const [copied, setCopied] = useState(false);

  // ---- Contribute / resource requests state ----
  const [requests, setRequests] = useState([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [reqError, setReqError] = useState('');
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqSubject, setReqSubject] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const categories = [
    'All',
    'Software Engineering',
    'Discrete Mathematics',
    'Java',
    'DevOps',
    'Applied Machine Learning',
  ];

  // ---- Data loaders ----
  const fetchResources = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (selectedCategory !== 'All') params.subject = selectedCategory;
      if (searchQuery.trim()) params.q = searchQuery.trim();
      const data = await listResources(params);
      setResources(data?.results || []);
    } catch (e) {
      setError(e.message || 'Failed to load resources.');
      setResources([]);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery]);

  const fetchRequests = useCallback(async () => {
    setReqLoading(true);
    setReqError('');
    try {
      const data = await listResourceRequests('open');
      setRequests(data?.results || []);
    } catch (e) {
      setReqError(e.message || 'Failed to load resource requests.');
      setRequests([]);
    } finally {
      setReqLoading(false);
    }
  }, []);

  // Debounced fetch on search/category change
  useEffect(() => {
    const t = setTimeout(() => { fetchResources(); }, 250);
    return () => clearTimeout(t);
  }, [fetchResources]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  // ---- Actions ----
  const handleUpvote = async (id) => {
    setResources((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: (r.upvotes || 0) + 1, upvoted: true } : r))
    );
    try {
      await upvoteResource(id);
    } catch (e) {
      // revert on failure
      setResources((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: Math.max(0, (r.upvotes || 1) - 1), upvoted: false } : r))
      );
      setError(e.message || 'Could not upvote resource.');
    }
  };

  const handleDownload = async (res) => {
    try {
      const data = await downloadResource(res.id);
      const url = data?.file_url || res.file_url;
      if (url) window.open(url, '_blank', 'noopener,noreferrer');
      setResources((prev) =>
        prev.map((r) => (r.id === res.id ? { ...r, downloads: (r.downloads || 0) + 1 } : r))
      );
    } catch (e) {
      setError(e.message || 'Could not download resource.');
    }
  };

  const handleUpvoteRequest = async (id) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: (r.upvotes || 0) + 1, upvoted: true } : r))
    );
    try {
      await upvoteResourceRequest(id);
    } catch (e) {
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, upvotes: Math.max(0, (r.upvotes || 1) - 1), upvoted: false } : r))
      );
      setReqError(e.message || 'Could not upvote request.');
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqSubject.trim()) {
      setFormError('Title and subject are required.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      await createResourceRequest({
        title: reqTitle.trim(),
        subject: reqSubject.trim(),
        description: reqDesc.trim(),
      });
      setShowReqModal(false);
      setReqTitle('');
      setReqSubject('');
      setReqDesc('');
      fetchRequests();
    } catch (err) {
      setFormError(err.message || 'Could not submit request.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSVG = (title) => {
    const svgElement = document.getElementById('qr-code-svg');
    if (!svgElement) return;
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = `${(title || 'resource').toLowerCase().replace(/\s+/g, '-')}-qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const getResourceIcon = (type) => {
    switch (String(type || '').toLowerCase()) {
      case 'pdf':
        return <FiFileText className="text-error" size={20} />;
      case 'video':
        return <FiVideo className="text-secondary" size={20} />;
      case 'repository':
      case 'repo':
        return <FiGithub className="text-primary" size={20} />;
      case 'paper':
        return <FiFileText className="text-primary" size={20} />;
      default:
        return <FiLink className="text-primary" size={20} />;
    }
  };

  const fmtDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt.getTime())) return String(d);
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Client-side sort of API results
  const sorted = [...resources].sort((a, b) => {
    if (sortBy === 'upvotes') return (b.upvotes || 0) - (a.upvotes || 0);
    if (sortBy === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
    if (sortBy === 'date') return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    if (sortBy === 'title') return String(a.title || '').localeCompare(String(b.title || ''));
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-on-surface">Resource Repository</h1>
          <p className="text-xs text-on-surface-variant">Surgically verified student cheat sheets, syllabus files, and developer boilerplates.</p>
        </div>
        <Button
          onClick={() => navigate('/dashboard?tab=upload')}
          variant="primary"
          size="sm"
          className="gap-2 shrink-0"
        >
          <FiPlus size={16} /> Upload Study Resource
        </Button>
      </div>

      {/* Search & Sort Panel */}
      <div className="flex flex-col lg:flex-row items-center gap-3">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search resources by title or subject..."
          className="flex-1"
        />

        {/* Sort Select */}
        <div className="flex items-center gap-2 w-full lg:w-auto shrink-0 bg-white border border-outline-variant rounded-lg px-3 py-1.5 shadow-sm text-xs font-semibold text-on-surface">
          <span className="text-on-surface-variant font-bold">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent border-none focus:outline-none cursor-pointer pr-4 font-bold text-primary"
          >
            <option value="upvotes">Most Upvoted</option>
            <option value="downloads">Most Downloaded</option>
            <option value="date">Newest First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition-all whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-primary-container text-white border-primary shadow-sm'
                : 'bg-white text-on-surface-variant border-outline-variant hover:border-outline hover:bg-surface-container'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] text-xs font-medium">
          <FiAlertCircle size={15} className="shrink-0 mt-0.5" />
          <span className="flex-1">{error}</span>
          <button onClick={fetchResources} className="font-bold underline shrink-0">Retry</button>
        </div>
      )}

      {/* Grid List / states */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 text-on-surface-variant">
          <FiLoader size={28} className="animate-spin text-primary" />
          <p className="text-xs font-semibold mt-3">Loading resources...</p>
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={FiInbox}
          title="No resources match your search"
          description="Try adjusting your subject filter, changing your keyword query, or reset the filters below."
          actionText="Reset Filters"
          onActionClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {sorted.map((res) => (
            <Card key={res.id} hoverable={true} className="flex flex-col justify-between gap-4 bg-white">
              <div className="space-y-3">
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center border border-outline-variant shrink-0 select-none">
                      {getResourceIcon(res.type)}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{res.subject}</span>
                      <h3 className="text-sm font-extrabold text-on-surface line-clamp-1 leading-snug mt-0.5">{res.title}</h3>
                    </div>
                  </div>
                  {res.type && <Badge variant="secondary">{res.type}</Badge>}
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant font-light leading-relaxed min-h-[36px] line-clamp-2">
                  {res.description}
                </p>

                {/* Meta chips */}
                <div className="flex flex-wrap gap-1.5">
                  {res.college && (
                    <span className="px-2 py-0.5 rounded bg-surface border border-outline-variant text-[10px] font-semibold text-on-surface-variant">
                      {res.college}
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded bg-surface border border-outline-variant text-[10px] font-semibold text-on-surface-variant inline-flex items-center gap-1">
                    <FiDownload size={10} /> {res.downloads || 0} downloads
                  </span>
                </div>
              </div>

              {/* Card Footer action bar */}
              <div className="pt-3.5 border-t border-outline-variant flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                  <span>{fmtDate(res.created_at)}</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Upvote Button */}
                  <button
                    onClick={() => handleUpvote(res.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all ${
                      res.upvoted
                        ? 'bg-rose-50 text-error border-error/20'
                        : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-outline hover:text-error'
                    }`}
                    title="Upvote"
                  >
                    <FiHeart className={res.upvoted ? 'fill-current text-error' : ''} size={13} />
                    <span>{res.upvotes || 0}</span>
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => setSharingResource(res)}
                    className="p-1.5 rounded-lg border border-outline-variant bg-transparent text-on-surface-variant hover:border-outline hover:text-primary transition-all flex items-center justify-center"
                    title="Share Offline (QR)"
                  >
                    <FiShare2 size={14} />
                  </button>

                  {/* Download button */}
                  <button
                    onClick={() => handleDownload(res)}
                    className="p-1.5 rounded-lg bg-surface border border-outline-variant text-on-surface hover:text-primary hover:border-primary transition-all flex items-center justify-center"
                    title="Download / Open Source"
                  >
                    <FiDownload size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* ================= Contribute: Resource Requests ================= */}
      <div className="pt-4 border-t border-outline-variant space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold font-poppins text-on-surface flex items-center gap-2">
              <FiHelpCircle className="text-primary" size={18} /> Contribute
            </h2>
            <p className="text-xs text-on-surface-variant">Open resource requests from the community. Upvote what you need or ask for something new.</p>
          </div>
          <Button
            onClick={() => { setFormError(''); setShowReqModal(true); }}
            variant="secondary"
            size="sm"
            className="gap-2 shrink-0"
          >
            <FiPlus size={15} /> Request a Resource
          </Button>
        </div>

        {reqError && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] text-xs font-medium">
            <FiAlertCircle size={15} className="shrink-0 mt-0.5" />
            <span className="flex-1">{reqError}</span>
            <button onClick={fetchRequests} className="font-bold underline shrink-0">Retry</button>
          </div>
        )}

        {reqLoading ? (
          <div className="flex flex-col items-center justify-center py-10 text-on-surface-variant">
            <FiLoader size={24} className="animate-spin text-primary" />
            <p className="text-xs font-semibold mt-3">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <EmptyState
            icon={FiHelpCircle}
            title="No open requests"
            description="Be the first to request a study resource the community can fulfil."
            actionText="Request a Resource"
            onActionClick={() => { setFormError(''); setShowReqModal(true); }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requests.map((rq) => (
              <Card key={rq.id} className="flex items-start justify-between gap-3 bg-white">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{rq.subject}</span>
                  <h3 className="text-sm font-extrabold text-on-surface leading-snug">{rq.title}</h3>
                  {rq.description && (
                    <p className="text-xs text-on-surface-variant font-light leading-relaxed line-clamp-2">{rq.description}</p>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="warning">{rq.status || 'open'}</Badge>
                    <span className="text-[10px] text-on-surface-variant">{fmtDate(rq.created_at)}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleUpvoteRequest(rq.id)}
                  className={`flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-lg border text-xs font-bold transition-all shrink-0 ${
                    rq.upvoted
                      ? 'bg-rose-50 text-error border-error/20'
                      : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-outline hover:text-error'
                  }`}
                  title="Upvote request"
                >
                  <FiHeart className={rq.upvoted ? 'fill-current text-error' : ''} size={14} />
                  <span>{rq.upvotes || 0}</span>
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Request a Resource Modal */}
      <Modal
        isOpen={showReqModal}
        onClose={() => setShowReqModal(false)}
        title="Request a Resource"
        size="sm"
      >
        <form onSubmit={handleCreateRequest} className="space-y-4">
          <InputField
            label="Title"
            placeholder="e.g., Operating Systems past-year papers"
            value={reqTitle}
            onChange={(e) => setReqTitle(e.target.value)}
            required
            id="req-title"
          />
          <InputField
            label="Subject"
            placeholder="e.g., Operating Systems"
            value={reqSubject}
            onChange={(e) => setReqSubject(e.target.value)}
            required
            id="req-subject"
          />
          <div className="space-y-1.5 text-left">
            <label htmlFor="req-desc" className="text-xs font-bold text-on-surface">Description</label>
            <textarea
              id="req-desc"
              value={reqDesc}
              onChange={(e) => setReqDesc(e.target.value)}
              placeholder="Describe what you're looking for so contributors can help..."
              className="w-full h-24 p-3 border border-outline-variant rounded-lg text-sm bg-white focus:outline-none focus:border-primary font-sans"
            />
          </div>

          {formError && (
            <div className="flex items-start gap-2 p-2.5 rounded-lg bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] text-xs font-medium">
              <FiAlertCircle size={14} className="shrink-0 mt-0.5" />
              <span>{formError}</span>
            </div>
          )}

          <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant">
            <Button type="button" onClick={() => setShowReqModal(false)} variant="outline" size="sm" disabled={submitting}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={submitting} className="gap-2">
              {submitting && <FiLoader size={14} className="animate-spin" />}
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Dynamic QR Sharing Modal */}
      {sharingResource && (
        <Modal
          isOpen={!!sharingResource}
          onClose={() => setSharingResource(null)}
          title="Offline Resource Sharing"
          size="sm"
        >
          <div className="text-center space-y-5">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-on-surface">{sharingResource.title}</h3>
              <p className="text-[11px] text-on-surface-variant">Scan this QR code offline to open or download this academic resource.</p>
            </div>

            <div className="p-3 bg-white border border-outline-variant rounded-xl inline-block shadow-sm">
              <svg id="qr-code-svg" className="w-44 h-44 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="10" fill="#f8fafc" />
                <rect x="2" y="2" width="96" height="96" rx="8" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                <rect x="8" y="8" width="20" height="20" rx="3" fill="#1e3a8a" />
                <rect x="12" y="12" width="12" height="12" rx="1" fill="#f8fafc" />
                <rect x="15" y="15" width="6" height="6" rx="0.5" fill="#2563eb" />
                <rect x="72" y="8" width="20" height="20" rx="3" fill="#1e3a8a" />
                <rect x="76" y="12" width="12" height="12" rx="1" fill="#f8fafc" />
                <rect x="79" y="15" width="6" height="6" rx="0.5" fill="#2563eb" />
                <rect x="8" y="72" width="20" height="20" rx="3" fill="#1e3a8a" />
                <rect x="12" y="76" width="12" height="12" rx="1" fill="#f8fafc" />
                <rect x="15" y="79" width="6" height="6" rx="0.5" fill="#2563eb" />
                <rect x="36" y="8" width="6" height="6" rx="1" fill="#0f172a" />
                <rect x="48" y="12" width="10" height="4" rx="1" fill="#0f172a" />
                <rect x="62" y="8" width="4" height="8" rx="1" fill="#0f172a" />
                <rect x="36" y="22" width="8" height="6" rx="1" fill="#0f172a" />
                <rect x="52" y="20" width="6" height="6" rx="1" fill="#0f172a" />
                <rect x="8" y="36" width="6" height="10" rx="1" fill="#0f172a" />
                <rect x="20" y="44" width="8" height="4" rx="1" fill="#0f172a" />
                <rect x="72" y="36" width="12" height="4" rx="1" fill="#0f172a" />
                <rect x="80" y="46" width="6" height="8" rx="1" fill="#0f172a" />
                <rect x="36" y="72" width="6" height="10" rx="1" fill="#0f172a" />
                <rect x="48" y="82" width="12" height="6" rx="1" fill="#0f172a" />
                <rect x="64" y="76" width="4" height="12" rx="1" fill="#0f172a" />
                <rect x="84" y="72" width="6" height="6" rx="1" fill="#0f172a" />
                <rect x="76" y="84" width="6" height="8" rx="1" fill="#0f172a" />
                <rect x="68" y="68" width="8" height="8" rx="1.5" fill="#1e3a8a" />
                <rect x="70" y="70" width="4" height="4" rx="0.5" fill="#f8fafc" />
                <rect x="71.5" y="71.5" width="1" height="1" fill="#1e3a8a" />
                <rect x="36" y="36" width="28" height="28" rx="6" fill="#1e40af" stroke="#ffffff" strokeWidth="2.5" />
                <path d="M43 45 C43 42, 57 42, 57 45 C57 51, 50 56, 50 56 C50 56, 43 51, 43 45 Z" fill="#ffffff" />
                <circle cx="50" cy="46" r="2" fill="#1e40af" />
              </svg>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => handleCopyLink(sharingResource.file_url || `${window.location.origin}/resources/${sharingResource.id}`)}
                variant="secondary"
                fullWidth
                className="gap-2 text-xs py-2.5"
              >
                {copied ? <FiCheckCircle className="text-success" size={15} /> : <FiCopy size={15} />}
                <span>{copied ? 'Copied Link!' : 'Copy Resource Link'}</span>
              </Button>

              <Button
                onClick={() => handleDownloadSVG(sharingResource.title)}
                variant="primary"
                fullWidth
                className="gap-2 text-xs py-2.5"
              >
                <FiDownload size={15} />
                <span>Download Vector QR Code</span>
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ResourceRepository;
