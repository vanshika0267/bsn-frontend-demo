import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit, FiMapPin, FiBriefcase, FiLink, FiDownload, FiCheck, 
  FiExternalLink, FiAward, FiBookOpen,
  FiCamera, FiTrash2, FiUpload, FiAlertCircle, FiX, FiPlus,
  FiFileText, FiRefreshCw
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import GitHubConnect from '../../components/github/GitHubConnect';
import Avatar from '../../components/common/Avatar';
import CoverBanner from '../../components/common/CoverBanner';

const ProfilePage = () => {
  const { user, updateProfile } = useApp();
  const navigate = useNavigate();

  // ---------- Inline Headline editing ----------
  const [isEditingHeadline, setIsEditingHeadline] = useState(false);
  const [headlineDraft, setHeadlineDraft] = useState(user.headline || '');
  const [headlineSaving, setHeadlineSaving] = useState(false);

  const startEditHeadline = () => {
    setHeadlineDraft(user.headline || '');
    setIsEditingHeadline(true);
  };
  const cancelEditHeadline = () => setIsEditingHeadline(false);
  const saveHeadline = async () => {
    setHeadlineSaving(true);
    try {
      await updateProfile({ headline: headlineDraft.trim() });
      setIsEditingHeadline(false);
    } finally {
      setHeadlineSaving(false);
    }
  };

  // ---------- Inline Bio editing ----------
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioDraft, setBioDraft] = useState(user.bio || '');
  const [bioSaving, setBioSaving] = useState(false);

  const startEditBio = () => {
    setBioDraft(user.bio || '');
    setIsEditingBio(true);
  };
  const cancelEditBio = () => setIsEditingBio(false);
  const saveBio = async () => {
    setBioSaving(true);
    try {
      await updateProfile({ bio: bioDraft.trim() });
      setIsEditingBio(false);
    } finally {
      setBioSaving(false);
    }
  };

  // ---------- Accomplishments & Awards (add / edit / delete) ----------
  const achievements = user.achievements || [];
  const [editingAchId, setEditingAchId] = useState(null);
  const [achDraft, setAchDraft] = useState(null);

  const handleAddAchievement = async () => {
    const newAch = {
      id: Date.now(),
      date: 'JAN ' + new Date().getFullYear(),
      title: 'New Accomplishment',
      description: 'Describe your award, publication, or achievement details here.'
    };
    await updateProfile({ achievements: [newAch, ...achievements] });
    setEditingAchId(newAch.id);
    setAchDraft(newAch);
  };

  const handleEditAchievementClick = (ach) => {
    setEditingAchId(ach.id);
    setAchDraft({ ...ach });
  };

  const handleAchDraftChange = (field, value) => {
    setAchDraft((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveAchievement = async () => {
    await updateProfile({
      achievements: achievements.map((a) => (a.id === achDraft.id ? achDraft : a))
    });
    setEditingAchId(null);
    setAchDraft(null);
  };

  const handleCancelAchievementEdit = () => {
    setEditingAchId(null);
    setAchDraft(null);
  };

  const handleDeleteAchievement = async (id) => {
    await updateProfile({ achievements: achievements.filter((a) => a.id !== id) });
    if (editingAchId === id) {
      setEditingAchId(null);
      setAchDraft(null);
    }
  };

  // ---------- Resume Management ----------
  const resumeInputRef = useRef(null);
  const [resumeError, setResumeError] = useState('');
  const [isResumeUploading, setIsResumeUploading] = useState(false);

  const triggerResumeSelect = () => {
    setResumeError('');
    resumeInputRef.current && resumeInputRef.current.click();
  };

  const handleResumeFileChange = (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;

    setResumeError('');

    const validExtensions = ['pdf', 'doc', 'docx'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!validExtensions.includes(fileExtension)) {
      setResumeError('Unsupported format. Please upload a PDF, DOC, or DOCX file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File is too large. Maximum size is 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      setIsResumeUploading(true);
      try {
        await updateProfile({
          resume: {
            name: file.name,
            url: reader.result,
            uploadedAt: new Date().toISOString()
          }
        });
      } finally {
        setIsResumeUploading(false);
      }
    };
    reader.onerror = () => setResumeError('Could not read the selected file. Please try again.');
    reader.readAsDataURL(file);
  };

  const handleRemoveResume = async () => {
    setResumeError('');
    await updateProfile({ resume: null });
  };

  const handleDownloadResume = () => {
    if (!user.resume || !user.resume.url) return;
    const link = document.createElement('a');
    link.href = user.resume.url;
    link.download = user.resume.name || 'resume';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---------- Profile Picture Modal states ----------
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.profilePicture);
  const [avatarError, setAvatarError] = useState('');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  const DEFAULT_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400";

  // ---------- Profile Cover Banner Modal states ----------
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState(user.coverBanner || DEFAULT_BANNER);
  const [coverError, setCoverError] = useState('');
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [coverSuccess, setCoverSuccess] = useState(false);

  // ---------- Portfolio Link ----------
  const [copied, setCopied] = useState(false);

  // Builds a link unique to the logged-in user, never the current/demo page URL.
  const getPortfolioUrl = () => {
    if (user.portfolioUrl) return user.portfolioUrl;
    const identifier = user.username || user.id || (user.email ? user.email.split('@')[0] : null);
    if (!identifier) return window.location.origin + '/portfolio';
    return `${window.location.origin}/portfolio/${identifier}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getPortfolioUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openAvatarModal = () => {
    setAvatarPreview(user.profilePicture);
    setAvatarError('');
    setAvatarSuccess(false);
    setIsAvatarModalOpen(true);
  };

  const openCoverModal = () => {
    setCoverPreview(user.coverBanner || DEFAULT_BANNER);
    setCoverError('');
    setCoverSuccess(false);
    setIsCoverModalOpen(true);
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    setCoverError('');
    setCoverSuccess(false);

    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExtension = ['png', 'jpg', 'jpeg'].includes(fileExtension);
    if (!validTypes.includes(file.type) && !isValidExtension) {
      setCoverError('Unsupported format. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setCoverError('File is too large. Maximum size is 10 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveCover = (e) => {
    e.preventDefault();
    if (coverError) return;

    setIsCoverUploading(true);
    setTimeout(() => {
      updateProfile({ coverBanner: coverPreview });
      setIsCoverUploading(false);
      setCoverSuccess(true);
      setTimeout(() => {
        setIsCoverModalOpen(false);
        setCoverSuccess(false);
      }, 1200);
    }, 1000);
  };

  const handleRemoveCover = () => {
    setCoverError('');
    setCoverSuccess(false);
    setCoverPreview(DEFAULT_BANNER);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatarError('');
    setAvatarSuccess(false);

    if (!file) return;

    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExtension = ['png', 'jpg', 'jpeg'].includes(fileExtension);
    if (!validTypes.includes(file.type) && !isValidExtension) {
      setAvatarError('Unsupported format. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('File is too large. Maximum size is 5 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAvatar = (e) => {
    e.preventDefault();
    if (avatarError) return;

    setIsAvatarUploading(true);
    setTimeout(() => {
      // updateProfile pushes the new picture into shared app context so
      // Navbar / Sidebar / Dashboard / Profile all re-render with it,
      // as long as they all read profilePicture from this same context.
      updateProfile({ profilePicture: avatarPreview });
      setIsAvatarUploading(false);
      setAvatarSuccess(true);
      setTimeout(() => {
        setIsAvatarModalOpen(false);
        setAvatarSuccess(false);
      }, 1200);
    }, 1000);
  };

  const handleRemoveAvatar = () => {
    setAvatarError('');
    setAvatarSuccess(false);
    setAvatarPreview('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Resume error banner */}
        {resumeError && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-semibold flex items-center justify-between">
            <span>{resumeError}</span>
            <button onClick={() => setResumeError('')} className="text-error hover:opacity-75">
              <FiX size={14} />
            </button>
          </div>
        )}

        {/* Hidden resume file input, shared by Upload/Replace */}
        <input
          type="file"
          ref={resumeInputRef}
          accept=".pdf,.doc,.docx"
          className="hidden"
          onChange={handleResumeFileChange}
        />

        {/* Profile Header & Banner Card */}
        <div className="bg-white rounded-xl overflow-hidden border border-outline-variant relative shadow-sm">
          
          {/* Cover Photo */}
          <div className="group/cover h-40 sm:h-52 w-full overflow-hidden relative">
            <CoverBanner
              src={user.coverBanner}
              alt="Profile cover banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            
            {/* Edit Cover Trigger Button */}
            <button
              onClick={openCoverModal}
              className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-3 py-1.5 bg-black/60 hover:bg-black/85 text-white rounded-lg transition-all duration-200 outline-none focus:ring-2 focus:ring-primary/25 cursor-pointer text-xs font-bold shadow-md select-none opacity-100 sm:opacity-0 sm:group-hover/cover:opacity-100"
              title="Edit cover banner"
            >
              <FiCamera size={14} className="shrink-0" />
              <span className="hidden sm:inline">Edit Cover</span>
            </button>
          </div>

          {/* Profile Details Container */}
          <div className="px-5 pb-5 pt-0 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
            {/* Avatar & text details */}
            <div className="flex flex-col sm:flex-row gap-4 items-start relative z-10 w-full md:w-auto">
              <div 
                onClick={openAvatarModal}
                className="group relative cursor-pointer overflow-hidden rounded-xl w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-white shadow-lg shrink-0 transition-transform duration-300 hover:scale-105 -mt-14 sm:-mt-16 bg-white"
                title="Click to update profile picture"
              >
                <Avatar
                  src={user.profilePicture}
                  alt={user.name}
                  className="rounded-xl"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 select-none">
                  <FiCamera size={18} className="animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-center px-1">Update Photo</span>
                </div>
              </div>

              <div className="space-y-1.5 sm:self-end pt-2 sm:pt-0 w-full max-w-lg">
                {/* Full Name — display only; editable via Settings */}
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface font-poppins">{user.name}</h1>
                  <Badge variant="primary">Verified Student</Badge>
                </div>

                {/* Headline — inline editable */}
                {!isEditingHeadline ? (
                  <div className="flex items-center gap-1.5 group/headline">
                    <p className="text-xs sm:text-sm text-on-surface-variant font-semibold">{user.headline || 'Add a headline'}</p>
                    <button
                      onClick={startEditHeadline}
                      className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors opacity-70 group-hover/headline:opacity-100"
                      title="Edit headline"
                    >
                      <FiEdit size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={headlineDraft}
                      onChange={(e) => setHeadlineDraft(e.target.value)}
                      autoFocus
                      placeholder="e.g. Computer Science Undergrad | Full-Stack Developer"
                      className="flex-1 text-xs sm:text-sm rounded-lg px-2.5 py-1.5 border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface font-sans"
                    />
                    <button
                      onClick={saveHeadline}
                      disabled={headlineSaving}
                      className="text-primary hover:opacity-75 p-1 rounded"
                      title="Save headline"
                    >
                      <FiCheck size={16} />
                    </button>
                    <button
                      onClick={cancelEditHeadline}
                      disabled={headlineSaving}
                      className="text-on-surface-variant hover:text-error p-1 rounded"
                      title="Cancel"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1"><FiMapPin size={13} /> {user.college}</span>
                  <span className="flex items-center gap-1"><FiBriefcase size={13} /> Score: {user.impactScore}</span>
                </div>
              </div>
            </div>

            {/* Actions button group */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto relative z-10 shrink-0">
              <Button onClick={handleCopyLink} variant="glass" size="sm" className="gap-1.5 py-2 px-3 text-xs">
                {copied ? <FiCheck size={14} className="text-[#166534]" /> : <FiLink size={14} />}
                {copied ? 'Copied URL' : 'Copy Portfolio'}
              </Button>

              {/* Resume actions */}
              {!user.resume ? (
                <Button
                  onClick={triggerResumeSelect}
                  variant="primary"
                  size="sm"
                  className="gap-1.5 py-2 px-3 text-xs"
                  disabled={isResumeUploading}
                >
                  <FiUpload size={14} /> {isResumeUploading ? 'Uploading...' : 'Upload Resume'}
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleDownloadResume}
                    variant="primary"
                    size="sm"
                    className="gap-1.5 py-2 px-3 text-xs"
                    title={user.resume.name}
                  >
                    <FiDownload size={14} /> Resume
                  </Button>
                  <Button
                    onClick={triggerResumeSelect}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 py-2 px-3 text-xs"
                    disabled={isResumeUploading}
                  >
                    <FiRefreshCw size={14} /> {isResumeUploading ? 'Uploading...' : 'Replace'}
                  </Button>
                  <Button
                    onClick={handleRemoveResume}
                    variant="outline"
                    size="sm"
                    className="gap-1.5 py-2 px-3 text-xs text-error hover:bg-error/10 hover:border-error/20"
                  >
                    <FiTrash2 size={14} /> Remove
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* 2 Grid Column Layout for Subsections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (1/3 cols) - Bio, Interests, Skills */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* About / Bio — inline editable */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-sm font-bold text-on-surface font-poppins">About Me</h3>
                {!isEditingBio && (
                  <button
                    onClick={startEditBio}
                    className="text-on-surface-variant hover:text-primary p-1 rounded transition-colors"
                    title="Edit bio"
                  >
                    <FiEdit size={13} />
                  </button>
                )}
              </div>

              {!isEditingBio ? (
                <p className="text-xs text-on-surface-variant leading-relaxed font-light whitespace-pre-line">
                  {user.bio || "No bio added yet."}
                </p>
              ) : (
                <div className="space-y-2.5">
                  <textarea
                    rows={5}
                    value={bioDraft}
                    onChange={(e) => setBioDraft(e.target.value)}
                    autoFocus
                    placeholder="Write a brief introduction about yourself..."
                    className="w-full text-xs rounded-lg p-3 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface transition-all font-sans"
                  />
                  <div className="flex gap-2 justify-end">
                    <Button onClick={cancelEditBio} variant="outline" size="sm" className="text-xs py-1 px-2.5" disabled={bioSaving}>
                      <FiX size={13} /> Cancel
                    </Button>
                    <Button onClick={saveBio} variant="primary" size="sm" className="text-xs py-1 px-2.5" disabled={bioSaving}>
                      <FiCheck size={13} /> {bioSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Verified Skills with progress rating */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-3.5 font-poppins">Verified Skill Index</h3>
              <div className="space-y-3.5">
                {(user.skills && user.skills.length > 0) ? (
                  user.skills.map((skill, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-semibold text-on-surface-variant">
                        <span>{skill.name}</span>
                        <span className="text-[10px] text-primary font-bold bg-[#eff6ff] px-1.5 py-0.5 rounded border border-primary/20">
                          {skill.level}
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${skill.value}%` }}
                          transition={{ duration: 0.8, ease: 'easeOut' }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant font-medium">No skills added yet.</p>
                )}
              </div>
            </div>

            {/* Academic Interests */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-3 font-poppins">Academic Interests</h3>
              <div className="flex flex-wrap gap-1.5">
                {(user.interests && user.interests.length > 0) ? (
                  user.interests.map((interest, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-surface border border-outline-variant text-on-surface-variant">
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-xs text-on-surface-variant font-medium">No interests added yet.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (2/3 cols) - Projects, Accomplishments, Shared Resources */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Github Connect & Live Repos */}
            <GitHubConnect />

            {/* Accomplishments & Awards — add / edit / delete, always available */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 font-poppins">
                  <FiAward className="text-primary" size={16} /> Accomplishments & Awards
                </h3>
                <Button type="button" onClick={handleAddAchievement} variant="outline" size="sm" className="gap-1 text-xs py-1 px-2.5">
                  <FiPlus size={13} /> Add
                </Button>
              </div>

              {achievements.length > 0 ? (
                <div className="relative pl-5 border-l border-outline-variant space-y-5">
                  {achievements.map((ach) => (
                    <div key={ach.id} className="relative space-y-1.5">
                      <span className="absolute -left-[25.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white"></span>

                      {editingAchId !== ach.id ? (
                        <>
                          <div className="flex items-start justify-between gap-2">
                            <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{ach.date}</span>
                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                onClick={() => handleEditAchievementClick(ach)}
                                className="text-on-surface-variant hover:text-primary p-1 rounded"
                                title="Edit"
                              >
                                <FiEdit size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteAchievement(ach.id)}
                                className="text-on-surface-variant hover:text-error p-1 rounded"
                                title="Delete"
                              >
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          </div>
                          <h4 className="text-xs font-bold text-on-surface">{ach.title}</h4>
                          <p className="text-[11px] text-on-surface-variant leading-relaxed font-light">{ach.description}</p>
                        </>
                      ) : (
                        <div className="p-3.5 -ml-5 bg-surface border border-outline-variant rounded-xl space-y-2.5">
                          <input
                            type="text"
                            value={achDraft.date}
                            onChange={(e) => handleAchDraftChange('date', e.target.value)}
                            placeholder="Date (e.g. JAN 2026)"
                            className="text-[10px] font-bold text-primary uppercase w-32 px-2.5 py-1 border border-outline-variant rounded bg-white outline-none"
                          />
                          <input
                            type="text"
                            value={achDraft.title}
                            onChange={(e) => handleAchDraftChange('title', e.target.value)}
                            placeholder="Achievement Title"
                            className="w-full text-xs font-bold text-on-surface px-2.5 py-1.5 border border-outline-variant rounded bg-white outline-none"
                          />
                          <textarea
                            rows={2}
                            value={achDraft.description}
                            onChange={(e) => handleAchDraftChange('description', e.target.value)}
                            placeholder="Achievement Description"
                            className="w-full text-[11px] text-on-surface-variant px-2.5 py-1.5 border border-outline-variant rounded bg-white outline-none"
                          />
                          <div className="flex gap-2 justify-end">
                            <Button onClick={handleCancelAchievementEdit} variant="outline" size="sm" className="text-xs py-1 px-2.5">
                              <FiX size={13} /> Cancel
                            </Button>
                            <Button onClick={handleSaveAchievement} variant="primary" size="sm" className="text-xs py-1 px-2.5">
                              <FiCheck size={13} /> Save
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant font-medium">No accomplishments added yet.</p>
              )}
            </div>

            {/* Shared Resources */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-3.5">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 font-poppins">
                  <FiBookOpen className="text-primary" size={16} /> Shared Resources Published
                </h3>
              </div>
              {(user.sharedResources && user.sharedResources.length > 0) ? (
                <div className="space-y-3">
                  {user.sharedResources.map((res) => (
                    <div key={res.id} className="p-3 bg-surface border border-outline-variant rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-[#eff6ff] border border-primary/20 flex items-center justify-center text-primary text-base shrink-0 select-none">
                          📄
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-on-surface">{res.title}</h4>
                          <p className="text-[10px] text-on-surface-variant mt-0.5">Category: {res.category} • {res.fileSize}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-on-surface-variant shrink-0 font-medium">
                        <span>Downloads: <strong>{res.downloads}</strong></span>
                        <span>Likes: <strong>{res.likes}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-on-surface-variant font-medium">No resources uploaded yet.</p>
              )}
            </div>

          </div>
        </div>

        {/* Profile Picture Upload Modal */}
        <Modal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          title="Update Profile Picture"
          size="sm"
        >
          <form onSubmit={handleSaveAvatar} className="space-y-5">
            <div className="flex flex-col sm:flex-row items-center gap-5 p-4 bg-surface rounded-xl border border-outline-variant/60">
              <div className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-outline-variant shadow-md">
                <img 
                  src={avatarPreview} 
                  alt="Profile preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 w-full space-y-2">
                <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/50 rounded-lg p-4 transition-all duration-200 bg-white hover:bg-primary/5 cursor-pointer">
                  <input 
                    type="file" 
                    id="avatar-upload-file" 
                    accept="image/png, image/jpeg, image/jpg" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleAvatarChange}
                  />
                  <FiUpload size={18} className="text-on-surface-variant group-hover:text-primary transition-colors duration-200" />
                  <span className="text-[11px] font-bold text-on-surface mt-1">Upload new photo</span>
                  <span className="text-[9px] text-on-surface-variant font-medium">PNG, JPG, JPEG (Max 5MB)</span>
                </div>
              </div>
            </div>

            {avatarError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-semibold"
              >
                <FiAlertCircle size={15} className="shrink-0" />
                <span>{avatarError}</span>
              </motion.div>
            )}

            {avatarSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] text-xs font-semibold"
              >
                <FiCheck size={15} className="shrink-0" />
                <span>Avatar saved successfully!</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleRemoveAvatar} 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border border-outline text-error hover:bg-error/10 hover:text-error hover:border-error/20 transition-all duration-200"
              >
                <FiTrash2 size={14} />
                Remove Current Photo
              </Button>
            </div>

            <div className="flex gap-3 justify-end pt-3.5 border-t border-outline-variant">
              <Button 
                onClick={() => setIsAvatarModalOpen(false)} 
                variant="outline" 
                size="sm"
                disabled={isAvatarUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="sm"
                disabled={isAvatarUploading}
                className="min-w-[80px]"
              >
                {isAvatarUploading ? 'Saving...' : 'Save Photo'}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Cover Banner Upload Modal */}
        <Modal
          isOpen={isCoverModalOpen}
          onClose={() => setIsCoverModalOpen(false)}
          title="Update Cover Banner"
          size="md"
        >
          <form onSubmit={handleSaveCover} className="space-y-5">
            <div className="flex flex-col items-center gap-3 p-4 bg-surface rounded-xl border border-outline-variant/60">
              <div className="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden border border-outline-variant shadow-md bg-surface-container">
                <img 
                  src={coverPreview} 
                  alt="Cover preview" 
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Preview Banner</span>
            </div>

            <div className="group relative flex flex-col items-center justify-center border-2 border-dashed border-outline-variant hover:border-primary/50 rounded-xl p-6 transition-all duration-200 bg-surface hover:bg-primary/5 cursor-pointer">
              <input 
                type="file" 
                id="cover-upload-file" 
                accept="image/png, image/jpeg, image/jpg" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleCoverChange}
              />
              <div className="flex flex-col items-center gap-2 text-center pointer-events-none">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
                  <FiUpload size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Click or drag banner here</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Supports PNG, JPG, JPEG (Max 10 MB)</p>
                </div>
              </div>
            </div>

            {coverError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-semibold"
              >
                <FiAlertCircle size={15} className="shrink-0" />
                <span>{coverError}</span>
              </motion.div>
            )}

            {coverSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 rounded-lg bg-[#dcfce7] border border-[#bbf7d0] text-[#166534] text-xs font-semibold"
              >
                <FiCheck size={15} className="shrink-0" />
                <span>Cover banner saved successfully!</span>
              </motion.div>
            )}

            <div className="flex flex-col gap-2">
              <Button 
                onClick={handleRemoveCover} 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border border-outline text-error hover:bg-error/10 hover:text-error hover:border-error/20 transition-all duration-200"
              >
                <FiTrash2 size={14} />
                Remove Current Banner (Restore Default)
              </Button>
            </div>

            <div className="flex gap-3 justify-end pt-3.5 border-t border-outline-variant">
              <Button 
                onClick={() => setIsCoverModalOpen(false)} 
                variant="outline" 
                size="sm"
                disabled={isCoverUploading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                size="sm"
                disabled={isCoverUploading}
                className="min-w-[80px]"
              >
                {isCoverUploading ? 'Saving...' : 'Save Banner'}
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;