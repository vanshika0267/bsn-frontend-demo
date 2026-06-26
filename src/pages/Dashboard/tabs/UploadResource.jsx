import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import InputField from '../../../components/common/InputField';
import Select from '../../../components/common/Select';
import Badge from '../../../components/common/Badge';
import Modal from '../../../components/common/Modal';
import { 
  FiArrowLeft, FiUploadCloud, FiTag, FiCheckCircle, 
  FiShield, FiCpu, FiAlertCircle, FiActivity, FiAward, FiCheck 
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const UploadResource = () => {
  const { user, setResourcesList, updateProfile } = useApp();
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Software Engineering');
  const [type, setType] = useState('PDF');
  const [link, setLink] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState(['study-notes']);
  
  // Drag and drop mock state
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [success, setSuccess] = useState(false);

  // Plagiarism Scan & AI Summarizer States (FR-C6 & FR-C7)
  const [scanStep, setScanStep] = useState('idle'); // idle, scanning, result
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatus, setScanStatus] = useState('Initializing scan...');
  const [aiSummary, setAiSummary] = useState('');

  const categories = [
    { value: 'Software Engineering', label: 'Software Engineering' },
    { value: 'Discrete Mathematics', label: 'Discrete Mathematics' },
    { value: 'Java', label: 'Java' },
    { value: 'DevOps', label: 'DevOps' },
    { value: 'Applied Machine Learning', label: 'Applied Machine Learning' }
  ];

  const types = [
    { value: 'PDF', label: 'PDF Document (.pdf)' },
    { value: 'Video', label: 'Video Lecture Link' },
    { value: 'Repository', label: 'GitHub Repository' },
    { value: 'Link', label: 'General URL / Website' }
  ];

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      // Auto fill title if blank
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase().replace(/,/g, '');
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setTagInput('');
      }
    }
  };

  const removeTag = (indexToRemove) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const triggerScan = () => {
    setScanStep('scanning');
    setScanProgress(0);
    setScanStatus('Analyzing text formatting & structure...');

    // Progress timer
    const interval = setInterval(() => {
      setScanProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          setScanStep('result');
          setAiSummary(
            `Comprehensive reference guide covering the core syllabus of ${category}. Features structured code walkthroughs, design pattern illustrations, cheat sheets, and practical project templates with complete explanations.`
          );
          return 100;
        }
        const next = p + 5;
        if (next === 30) {
          setScanStatus('Checking database for duplicate references (FR-C6)...');
        } else if (next === 65) {
          setScanStatus('Generating Stitch AI summary (FR-C7)...');
        } else if (next === 85) {
          setScanStatus('Finalizing verification signature...');
        }
        return next;
      });
    }, 100);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !link.trim()) return;
    triggerScan();
  };

  const handleFinalPublish = () => {
    // Create new item
    const newItem = {
      id: Date.now(),
      title,
      description,
      category,
      type,
      link: link.startsWith('http') ? link : `https://${link}`,
      tags: tags.length > 0 ? tags : ['guide'],
      uploadedBy: user.name,
      upvotes: 0,
      upvoted: false,
      saved: false,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      aiSummary: aiSummary
    };

    // Update resources database
    setResourcesList(prev => [newItem, ...prev]);

    // Increase user impact score
    updateProfile({
      impactScore: user.impactScore + 40,
      impactProgress: Math.min(100, user.impactProgress + 4)
    });

    setScanStep('idle');
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      navigate('/dashboard?tab=resources');
    }, 1800);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Back navigation header */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => navigate('/dashboard?tab=resources')}
          className="p-2 rounded-lg bg-white border border-outline-variant hover:border-primary text-on-surface-variant hover:text-primary transition-all shadow-sm"
        >
          <FiArrowLeft size={16} />
        </button>
        <div>
          <h1 className="text-xl font-bold font-poppins text-on-surface">Share Learning Resource</h1>
          <p className="text-xs text-on-surface-variant">Publish documents, videos, and boilerplates to the network catalog.</p>
        </div>
      </div>

      {success ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 border border-green-200 flex items-center justify-center animate-bounce">
            <FiCheckCircle size={32} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-on-surface">Resource Shared Successfully!</h2>
            <p className="text-xs text-on-surface-variant mt-1">
              Thank you for contributing! Your profile has been awarded <strong>+40 Impact Score Points</strong>.
            </p>
          </div>
          <div className="p-3 bg-[#eff6ff] border border-primary/20 rounded-lg text-[11px] text-[#1e40af] font-bold">
            Redirecting you back to the Resource Repository...
          </div>
        </Card>
      ) : (
        <Card className="bg-white p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <InputField
              label="Resource Title"
              placeholder="e.g., Advanced Algorithm Practice Notebook"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              id="upload-title"
            />

            {/* Description */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Give a brief summary detailing what curriculum content or practical framework this resource covers..."
                className="w-full h-24 p-3 border border-outline-variant rounded-lg text-sm bg-white focus:outline-none focus:border-primary font-sans"
                required
              />
            </div>

            {/* Selects: Category & Type */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Learning Track / Category"
                options={categories}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                id="upload-cat"
              />

              <Select
                label="Resource Format"
                options={types}
                value={type}
                onChange={(e) => setType(e.target.value)}
                id="upload-type"
              />
            </div>

            {/* Link URL */}
            <InputField
              label="Resource Access URL (GitHub, Drive, PDF Link)"
              placeholder="e.g., github.com/username/project-repo"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              required
              id="upload-link"
            />

            {/* Drag & Drop mockup */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface">Attach Document (Optional Preview)</label>
              <div 
                className={`border-2 border-dashed rounded-lg p-5 text-center transition-all cursor-pointer ${
                  dragActive ? 'border-primary bg-primary-container/5' : 'border-outline-variant hover:border-primary'
                }`}
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input 
                  type="file" 
                  id="file-upload" 
                  className="hidden" 
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.zip,.txt"
                />
                <FiUploadCloud size={28} className="mx-auto text-on-surface-variant/60 mb-2" />
                <span className="text-xs font-bold text-on-surface block">
                  {selectedFile ? selectedFile.name : 'Drag & drop file here or click to browse'}
                </span>
                <span className="text-[10px] text-on-surface-variant block mt-1">
                  Supports PDF, DOCX, ZIP files up to 20MB.
                </span>
              </div>
            </div>

            {/* Tag Inputs */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                <FiTag size={12} /> Tags / Skills covered (Press Enter or Comma to add)
              </label>
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                placeholder="e.g., react, node, exam-review"
                className="w-full px-3 py-2 border border-outline-variant rounded-lg text-sm bg-white focus:outline-none focus:border-primary font-sans"
              />
              
              {/* Active Tags Display */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#eff6ff] text-[#1e40af] border border-primary/20"
                    >
                      #{tag}
                      <button 
                        type="button" 
                        onClick={() => removeTag(idx)}
                        className="hover:text-red-500 font-bold ml-0.5 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Alert info */}
            <div className="p-3 bg-[#eff6ff] border border-primary/20 rounded-lg text-[11px] text-[#1e40af] font-medium leading-relaxed text-left">
              💡 <strong>Impact Score boost!</strong> Uploading a validated study resource yields an immediate <strong>+40 Impact Score points</strong> to boost your leaderboard standing.
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end pt-3 border-t border-outline-variant">
              <Button 
                type="button" 
                onClick={() => navigate('/dashboard?tab=resources')} 
                variant="outline" 
                size="sm"
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Publish Study Resource
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Stitch AI Integrity Scan Modal (FR-C6 & FR-C7) */}
      {scanStep === 'scanning' && (
        <Modal
          isOpen={true}
          onClose={() => setScanStep('idle')}
          title="Stitch AI integrity & Sourcing Scan"
          size="sm"
        >
          <div className="text-center py-6 space-y-6">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-outline-variant"></div>
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
              <FiCpu className="text-primary animate-pulse" size={28} />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-on-surface">Scanning Upload File Content</h3>
              <p className="text-xs text-on-surface-variant font-medium min-h-[32px]">{scanStatus}</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5 max-w-xs mx-auto">
              <div className="w-full bg-surface-container rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-primary h-full rounded-full transition-all duration-100" 
                  style={{ width: `${scanProgress}%` }}
                ></div>
              </div>
              <span className="text-[10px] font-bold text-primary font-mono">{scanProgress}% Checked</span>
            </div>
          </div>
        </Modal>
      )}

      {/* Stitch AI Verification Report Modal */}
      {scanStep === 'result' && (
        <Modal
          isOpen={true}
          onClose={() => setScanStep('idle')}
          title="Stitch AI Verification Report"
          size="md"
        >
          <div className="space-y-5">
            {/* Header / Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-surface rounded-xl border border-outline-variant">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-50 text-green-500 border border-green-200 flex items-center justify-center">
                  <FiShield size={20} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">Originality Verified</h4>
                  <p className="text-[10px] text-on-surface-variant">Passed structural similarity limits.</p>
                </div>
              </div>
              <div className="flex flex-col sm:items-end">
                <span className="text-xs font-extrabold text-green-600">0.8% Similarity</span>
                <span className="text-[9px] text-on-surface-variant uppercase font-bold tracking-wide">99.2% Unique Content</span>
              </div>
            </div>

            {/* AI Summary Section */}
            <div className="space-y-1.5 text-left">
              <label className="text-xs font-bold text-on-surface flex items-center gap-1">
                <FiAward className="text-primary" size={13} /> Stitch AI Generated Summary (FR-C7)
              </label>
              <p className="text-[10px] text-on-surface-variant leading-relaxed">
                Stitch LLM has summarized your document. Review and modify the summary preview below before publishing to the index catalog:
              </p>
              <textarea
                value={aiSummary}
                onChange={(e) => setAiSummary(e.target.value)}
                className="w-full h-24 p-3 border border-outline-variant rounded-lg text-xs bg-white focus:outline-none focus:border-primary font-sans leading-relaxed text-on-surface"
                required
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-3 border-t border-outline-variant">
              <Button
                type="button"
                onClick={() => setScanStep('idle')}
                variant="outline"
                size="sm"
              >
                Cancel Publish
              </Button>
              <Button
                type="button"
                onClick={handleFinalPublish}
                variant="primary"
                size="sm"
                className="gap-1.5"
              >
                <FiCheck size={15} /> Approve & Publish
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default UploadResource;
