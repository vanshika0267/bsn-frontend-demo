import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { 
  FiHeart, 
  FiBookmark, 
  FiExternalLink, 
  FiPlus, 
  FiDownload,
  FiFileText,
  FiVideo,
  FiGithub,
  FiLink,
  FiShare2,
  FiCheckCircle,
  FiCopy
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const ResourceRepository = () => {
  const { resourcesList, setResourcesList, searchQuery, setSearchQuery } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('upvotes'); // upvotes, date, title
  const [sharingResource, setSharingResource] = useState(null);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleCopyLink = (url) => {
    navigator.clipboard.writeText(window.location.origin + url);
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
    downloadLink.download = `${title.toLowerCase().replace(/\s+/g, '-')}-qr.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  // Categories list
  const categories = [
    'All', 
    'Software Engineering', 
    'Discrete Mathematics', 
    'Java', 
    'DevOps', 
    'Applied Machine Learning'
  ];

  // Upvote Handler
  const handleUpvote = (id) => {
    setResourcesList(prev => 
      prev.map(res => {
        if (res.id === id) {
          const upvoted = !res.upvoted;
          return {
            ...res,
            upvoted,
            upvotes: upvoted ? res.upvotes + 1 : res.upvotes - 1
          };
        }
        return res;
      })
    );
  };

  // Toggle Save Handler
  const handleSave = (id) => {
    setResourcesList(prev => 
      prev.map(res => res.id === id ? { ...res, saved: !res.saved } : res)
    );
  };

  // Icon selector based on resource type
  const getResourceIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'pdf':
        return <FiFileText className="text-error" size={20} />;
      case 'video':
        return <FiVideo className="text-secondary" size={20} />;
      case 'repository':
        return <FiGithub className="text-primary" size={20} />;
      default:
        return <FiLink className="text-primary" size={20} />;
    }
  };

  // Filter and search logic
  const filtered = resourcesList.filter(res => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      res.title.toLowerCase().includes(query) ||
      res.uploadedBy.toLowerCase().includes(query) ||
      res.tags.some(tag => tag.toLowerCase().includes(query));
    
    const matchesCategory = selectedCategory === 'All' || res.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Sort logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'upvotes') {
      return b.upvotes - a.upvotes;
    } else if (sortBy === 'date') {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
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
          placeholder="Search resources by title, creator, or skill tags..."
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

      {/* Grid List */}
      {sorted.length === 0 ? (
        <Card className="p-8 text-center border-dashed flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3 text-lg font-bold">
            🔎
          </div>
          <h3 className="text-sm font-bold text-on-surface">No resources match your search</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
            Try adjusting your category filter, changing your keyword query, or search tags.
          </p>
          <Button 
            onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
            variant="secondary" 
            size="sm" 
            className="mt-4"
          >
            Reset Filters
          </Button>
        </Card>
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
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{res.category}</span>
                      <h3 className="text-sm font-extrabold text-on-surface line-clamp-1 leading-snug mt-0.5">{res.title}</h3>
                    </div>
                  </div>
                  <Badge variant="secondary">{res.type}</Badge>
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant font-light leading-relaxed min-h-[36px] line-clamp-2">
                  {res.description}
                </p>

                {/* Tags List */}
                <div className="flex flex-wrap gap-1.5">
                  {res.tags?.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 rounded bg-surface border border-outline-variant text-[10px] font-semibold text-on-surface-variant"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer action bar */}
              <div className="pt-3.5 border-t border-outline-variant flex items-center justify-between mt-auto">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                  <span>Uploaded by: <strong className="text-on-surface font-semibold">{res.uploadedBy}</strong></span>
                  <span className="text-on-surface-variant/40">•</span>
                  <span>{res.date}</span>
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
                  >
                    <FiHeart className={res.upvoted ? 'fill-current text-error' : ''} size={13} />
                    <span>{res.upvotes}</span>
                  </button>

                  {/* Bookmark Button */}
                  <button
                    onClick={() => handleSave(res.id)}
                    className={`p-1.5 rounded-lg border transition-all ${
                      res.saved
                        ? 'bg-amber-50 text-amber-500 border-amber-300/30'
                        : 'bg-transparent text-on-surface-variant border-outline-variant hover:border-outline hover:text-amber-500'
                    }`}
                    title={res.saved ? "Saved to Bookmarks" : "Save Resource"}
                  >
                    <FiBookmark className={res.saved ? 'fill-current text-amber-500' : ''} size={14} />
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={() => setSharingResource(res)}
                    className="p-1.5 rounded-lg border border-outline-variant bg-transparent text-on-surface-variant hover:border-outline hover:text-primary transition-all flex items-center justify-center"
                    title="Share Offline (QR)"
                  >
                    <FiShare2 size={14} />
                  </button>

                  {/* Get Link button */}
                  <a
                    href={res.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-lg bg-surface border border-outline-variant text-on-surface hover:text-primary hover:border-primary transition-all flex items-center justify-center"
                    title="View / Download Source"
                  >
                    <FiExternalLink size={14} />
                  </a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

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

            {/* Styled vector QR Code */}
            <div className="p-3 bg-white border border-outline-variant rounded-xl inline-block shadow-sm">
              <svg id="qr-code-svg" className="w-44 h-44 mx-auto" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="100" height="100" rx="10" fill="#f8fafc" />
                <rect x="2" y="2" width="96" height="96" rx="8" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 3" />
                
                {/* QR finder patterns */}
                <rect x="8" y="8" width="20" height="20" rx="3" fill="#1e3a8a" />
                <rect x="12" y="12" width="12" height="12" rx="1" fill="#f8fafc" />
                <rect x="15" y="15" width="6" height="6" rx="0.5" fill="#2563eb" />
                
                <rect x="72" y="8" width="20" height="20" rx="3" fill="#1e3a8a" />
                <rect x="76" y="12" width="12" height="12" rx="1" fill="#f8fafc" />
                <rect x="79" y="15" width="6" height="6" rx="0.5" fill="#2563eb" />
                
                <rect x="8" y="72" width="20" height="20" rx="3" fill="#1e3a8a" />
                <rect x="12" y="76" width="12" height="12" rx="1" fill="#f8fafc" />
                <rect x="15" y="79" width="6" height="6" rx="0.5" fill="#2563eb" />
                
                {/* Simulated QR Code patterns / data dots */}
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
                
                {/* Alignment pattern */}
                <rect x="68" y="68" width="8" height="8" rx="1.5" fill="#1e3a8a" />
                <rect x="70" y="70" width="4" height="4" rx="0.5" fill="#f8fafc" />
                <rect x="71.5" y="71.5" width="1" height="1" fill="#1e3a8a" />

                {/* Center Badge overlay */}
                <rect x="36" y="36" width="28" height="28" rx="6" fill="#1e40af" stroke="#ffffff" strokeWidth="2.5" />
                <path d="M43 45 C43 42, 57 42, 57 45 C57 51, 50 56, 50 56 C50 56, 43 51, 43 45 Z" fill="#ffffff" />
                <circle cx="50" cy="46" r="2" fill="#1e40af" />
              </svg>
            </div>

            {/* Sharing Actions */}
            <div className="flex flex-col gap-2 pt-2">
              <Button
                onClick={() => handleCopyLink(`/resources/${sharingResource.id}`)}
                variant="secondary"
                fullWidth
                className="gap-2 text-xs py-2.5"
              >
                {copied ? <FiCheckCircle className="text-success" size={15} /> : <FiCopy size={15} />}
                <span>{copied ? "Copied BSN Link!" : "Copy BSN Page Link"}</span>
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
