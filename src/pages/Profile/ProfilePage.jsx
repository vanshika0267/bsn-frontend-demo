import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiEdit, FiMapPin, FiBriefcase, FiLink, FiDownload, FiCheck, 
  FiGithub, FiExternalLink, FiAward, FiBookOpen,
  FiCamera, FiTrash2, FiUpload, FiAlertCircle, FiX, FiPlus
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import GitHubConnect from '../../components/github/GitHubConnect';
import Avatar from '../../components/common/Avatar';
import CoverBanner from '../../components/common/CoverBanner';

const ProfilePage = () => {
  const { user, updateProfile } = useApp();
  const navigate = useNavigate();
  const hasProfilePicture = Boolean(user.profilePicture && user.profilePicture.toString().trim());

  // Page-Wide Single Edit Profile Mode state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');
  const firstInputRef = useRef(null);

  // Editable Form States
  const [editName, setEditName] = useState(user.name || '');
  const [editHeadline, setEditHeadline] = useState(user.headline || '');
  const [editCollege, setEditCollege] = useState(user.college || '');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [editSkills, setEditSkills] = useState(user.skills || []);
  const [editInterests, setEditInterests] = useState(user.interests || []);
  const [editAchievements, setEditAchievements] = useState(user.achievements || []);
  const [editResources, setEditResources] = useState(user.sharedResources || []);

  // Temporary Inputs for Adding Items in Edit Mode
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [newInterestName, setNewInterestName] = useState('');
  
  // Profile Picture Modal states
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(user.profilePicture);
  const [avatarError, setAvatarError] = useState('');
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [avatarSuccess, setAvatarSuccess] = useState(false);

  const DEFAULT_BANNER = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200&h=400";

  // Profile Cover Banner Modal states
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverPreview, setCoverPreview] = useState(user.coverBanner || DEFAULT_BANNER);
  const [coverError, setCoverError] = useState('');
  const [isCoverUploading, setIsCoverUploading] = useState(false);
  const [coverSuccess, setCoverSuccess] = useState(false);

  // Copied alert state
  const [copied, setCopied] = useState(false);

  // Toggle Edit Mode Handlers
  const handleStartEdit = () => {
    setEditName(user.name || '');
    setEditHeadline(user.headline || '');
    setEditCollege(user.college || '');
    setEditBio(user.bio || '');
    setEditSkills([...(user.skills || [])]);
    setEditInterests([...(user.interests || [])]);
    setEditAchievements([...(user.achievements || [])]);
    setEditResources([...(user.sharedResources || [])]);
    setProfileError('');
    setIsEditingProfile(true);

    setTimeout(() => {
      if (firstInputRef.current) {
        firstInputRef.current.focus();
      }
    }, 100);
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    setProfileError('');
    setEditName(user.name || '');
    setEditHeadline(user.headline || '');
    setEditCollege(user.college || '');
    setEditBio(user.bio || '');
    setEditSkills(user.skills || []);
    setEditInterests(user.interests || []);
    setEditAchievements(user.achievements || []);
    setEditResources(user.sharedResources || []);
  };

  const handleSaveProfile = async (e) => {
    if (e) e.preventDefault();
    setProfileError('');

    if (!editName.trim()) {
      setProfileError('Full Name is required.');
      return;
    }

    setIsSubmittingProfile(true);
    try {
      await updateProfile({
        name: editName.trim(),
        headline: editHeadline.trim(),
        college: editCollege.trim(),
        bio: editBio.trim(),
        skills: editSkills,
        interests: editInterests,
        achievements: editAchievements,
        sharedResources: editResources
      });
      setIsEditingProfile(false);
    } catch (err) {
      setProfileError(err?.message || 'Failed to save profile changes.');
    } finally {
      setIsSubmittingProfile(false);
    }
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.portfolioUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper functions for Skill/Interest/Achievement/Resource editing
  const handleAddSkill = () => {
    const val = newSkillName.trim();
    if (!val) return;
    if (editSkills.some(s => s.name.toLowerCase() === val.toLowerCase())) return;
    setEditSkills([...editSkills, { name: val, level: newSkillLevel, value: newSkillLevel === 'Expert' ? 95 : newSkillLevel === 'Advanced' ? 85 : 65 }]);
    setNewSkillName('');
  };

  const handleRemoveSkill = (index) => {
    setEditSkills(editSkills.filter((_, i) => i !== index));
  };

  const handleAddInterest = () => {
    const val = newInterestName.trim();
    if (!val) return;
    if (editInterests.some(i => i.toLowerCase() === val.toLowerCase())) return;
    setEditInterests([...editInterests, val]);
    setNewInterestName('');
  };

  const handleRemoveInterest = (index) => {
    setEditInterests(editInterests.filter((_, i) => i !== index));
  };

  const handleAddAchievement = () => {
    const newAch = {
      id: Date.now(),
      date: 'JAN ' + new Date().getFullYear(),
      title: 'New Accomplishment',
      description: 'Describe your award, publication, or achievement details here.'
    };
    setEditAchievements([newAch, ...editAchievements]);
  };

  const handleRemoveAchievement = (index) => {
    setEditAchievements(editAchievements.filter((_, i) => i !== index));
  };

  const handleAddResource = () => {
    const newRes = {
      id: Date.now(),
      title: 'New Study Guide / Cheat Sheet',
      category: 'Notes',
      fileSize: '2.5 MB',
      downloads: 0,
      likes: 0
    };
    setEditResources([newRes, ...editResources]);
  };

  const handleRemoveResource = (index) => {
    setEditResources(editResources.filter((_, i) => i !== index));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* Floating Active Edit Banner */}
        <AnimatePresence>
          {isEditingProfile && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-3.5 bg-[#eff6ff] dark:bg-slate-900 border border-primary/30 dark:border-primary/40 rounded-xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 sticky top-4 z-30"
            >
              <div className="flex items-center gap-2.5 text-xs font-bold text-primary dark:text-blue-400">
                <FiEdit size={16} className="shrink-0 animate-pulse" />
                <span>Profile Edit Mode Active — Modify your profile details below and click Save Profile when finished.</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  onClick={handleSaveProfile}
                  variant="primary"
                  size="sm"
                  disabled={isSubmittingProfile}
                  className="gap-1.5 py-1.5 px-3.5 text-xs"
                >
                  <FiCheck size={14} />
                  <span>{isSubmittingProfile ? 'Saving...' : 'Save Profile'}</span>
                </Button>
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSubmittingProfile}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <FiX size={14} />
                  <span>Cancel</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Global Error Banner */}
        {profileError && (
          <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-semibold flex items-center justify-between">
            <span>{profileError}</span>
            <button onClick={() => setProfileError('')} className="text-error hover:opacity-75">
              <FiX size={14} />
            </button>
          </div>
        )}
        
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

              {!isEditingProfile ? (
                <div className="space-y-1 sm:self-end pt-2 sm:pt-0">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-extrabold text-on-surface font-poppins">{user.name}</h1>
                    <Badge variant="primary">Verified Student</Badge>
                  </div>
                  <p className="text-xs sm:text-sm text-on-surface-variant font-semibold">{user.headline}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-on-surface-variant font-medium">
                    <span className="flex items-center gap-1"><FiMapPin size={13} /> {user.college}</span>
                    <span className="flex items-center gap-1"><FiBriefcase size={13} /> Score: {user.impactScore}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 w-full max-w-lg pt-3">
                  <InputField
                    label="Full Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    inputRef={firstInputRef}
                    id="edit-profile-name"
                  />
                  <InputField
                    label="Headline / Professional Title"
                    value={editHeadline}
                    onChange={(e) => setEditHeadline(e.target.value)}
                    id="edit-profile-headline"
                  />
                  <InputField
                    label="Institution / College"
                    value={editCollege}
                    onChange={(e) => setEditCollege(e.target.value)}
                    readOnly={true}
                    id="edit-profile-college"
                  />
                </div>
              )}
            </div>

            {/* Actions button group */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto relative z-10 shrink-0">
              {!isEditingProfile ? (
                <Button onClick={handleStartEdit} variant="secondary" size="sm" className="gap-1.5 py-2 px-3 text-xs" id="btn-edit-profile-main">
                  <FiEdit size={14} /> Edit Profile
                </Button>
              ) : (
                <>
                  <Button onClick={handleSaveProfile} variant="primary" size="sm" className="gap-1.5 py-2 px-3 text-xs" disabled={isSubmittingProfile}>
                    <FiCheck size={14} /> {isSubmittingProfile ? 'Saving...' : 'Save Profile'}
                  </Button>
                  <Button onClick={handleCancelEdit} variant="outline" size="sm" className="gap-1.5 py-2 px-3 text-xs" disabled={isSubmittingProfile}>
                    <FiX size={14} /> Cancel
                  </Button>
                </>
              )}
              <Button onClick={handleCopyLink} variant="glass" size="sm" className="gap-1.5 py-2 px-3 text-xs">
                {copied ? <FiCheck size={14} className="text-[#166534]" /> : <FiLink size={14} />}
                {copied ? 'Copied URL' : 'Copy Portfolio'}
              </Button>
              <Button variant="primary" size="sm" className="gap-1.5 py-2 px-3 text-xs">
                <FiDownload size={14} /> Resume
              </Button>
            </div>
          </div>
        </div>

        {/* 2 Grid Column Layout for Subsections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (1/3 cols) - Bio, Interests, Skills */}
          <div className="space-y-6 lg:col-span-1">
            
            {/* About / Bio */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-2.5 font-poppins">About Me</h3>
              {!isEditingProfile ? (
                <p className="text-xs text-on-surface-variant leading-relaxed font-light whitespace-pre-line">
                  {user.bio || "No bio added yet."}
                </p>
              ) : (
                <div className="flex flex-col gap-1.5 w-full">
                  <label htmlFor="edit-bio-area" className="text-xs font-semibold text-on-surface-variant">
                    Bio Description
                  </label>
                  <textarea
                    id="edit-bio-area"
                    rows={5}
                    value={editBio}
                    onChange={(e) => setEditBio(e.target.value)}
                    placeholder="Write a brief introduction about yourself..."
                    className="w-full text-xs rounded-lg p-3 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface transition-all font-sans"
                  />
                </div>
              )}
            </div>

            {/* Verified Skills with progress rating */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-3.5 font-poppins">Verified Skill Index</h3>
              
              {!isEditingProfile ? (
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
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Skill (e.g. TypeScript)"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      className="flex-1 text-xs rounded-lg px-3 py-2 border border-outline-variant focus:border-primary outline-none"
                    />
                    <select
                      value={newSkillLevel}
                      onChange={(e) => setNewSkillLevel(e.target.value)}
                      className="text-xs rounded-lg px-2 py-2 border border-outline-variant bg-white outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                    <Button type="button" onClick={handleAddSkill} variant="primary" size="sm" className="px-3">
                      <FiPlus size={14} />
                    </Button>
                  </div>

                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {editSkills.map((sk, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-surface border border-outline-variant/60 rounded-lg text-xs">
                        <span className="font-bold text-on-surface">{sk.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-[#eff6ff] rounded border border-primary/20">{sk.level}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(idx)}
                            className="text-on-surface-variant hover:text-error p-1 rounded"
                            title="Remove Skill"
                          >
                            <FiX size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Academic Interests */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-3 font-poppins">Academic Interests</h3>
              
              {!isEditingProfile ? (
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
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add Interest (e.g. Web3)"
                      value={newInterestName}
                      onChange={(e) => setNewInterestName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddInterest();
                        }
                      }}
                      className="flex-1 text-xs rounded-lg px-3 py-2 border border-outline-variant focus:border-primary outline-none"
                    />
                    <Button type="button" onClick={handleAddInterest} variant="primary" size="sm" className="px-3">
                      <FiPlus size={14} />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {editInterests.map((interest, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#eff6ff] text-[#1e40af] border border-primary/20">
                        <span>{interest}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveInterest(idx)}
                          className="hover:text-error cursor-pointer"
                          title="Remove Interest"
                        >
                          <FiX size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column (2/3 cols) - Projects, Experience timeline, Shared Resources */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Github Connect & Live Repos */}
            <GitHubConnect />

            {/* Achievements Timeline */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 font-poppins">
                  <FiAward className="text-primary" size={16} /> Accomplishments & Awards
                </h3>
                {isEditingProfile && (
                  <Button type="button" onClick={handleAddAchievement} variant="outline" size="sm" className="gap-1 text-xs py-1 px-2.5">
                    <FiPlus size={13} /> Add
                  </Button>
                )}
              </div>
              
              {!isEditingProfile ? (
                (user.achievements && user.achievements.length > 0) ? (
                  <div className="relative pl-5 border-l border-outline-variant space-y-5">
                    {user.achievements.map((ach) => (
                      <div key={ach.id} className="relative space-y-1">
                        <span className="absolute -left-[25.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white"></span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{ach.date}</span>
                        <h4 className="text-xs font-bold text-on-surface">{ach.title}</h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed font-light">{ach.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-on-surface-variant font-medium">No accomplishments added yet.</p>
                )
              ) : (
                <div className="space-y-3.5">
                  {editAchievements.map((ach, idx) => (
                    <div key={ach.id || idx} className="p-3.5 bg-surface border border-outline-variant rounded-xl space-y-2.5">
                      <div className="flex items-center justify-between gap-2">
                        <input
                          type="text"
                          value={ach.date}
                          onChange={(e) => {
                            const updated = [...editAchievements];
                            updated[idx].date = e.target.value;
                            setEditAchievements(updated);
                          }}
                          placeholder="Date (e.g. JAN 2026)"
                          className="text-[10px] font-bold text-primary uppercase w-32 px-2.5 py-1 border border-outline-variant rounded bg-white outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveAchievement(idx)}
                          className="text-on-surface-variant hover:text-error p-1 rounded"
                          title="Delete Accomplishment"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={ach.title}
                        onChange={(e) => {
                          const updated = [...editAchievements];
                          updated[idx].title = e.target.value;
                          setEditAchievements(updated);
                        }}
                        placeholder="Achievement Title"
                        className="w-full text-xs font-bold text-on-surface px-2.5 py-1.5 border border-outline-variant rounded bg-white outline-none"
                      />
                      <textarea
                        rows={2}
                        value={ach.description}
                        onChange={(e) => {
                          const updated = [...editAchievements];
                          updated[idx].description = e.target.value;
                          setEditAchievements(updated);
                        }}
                        placeholder="Achievement Description"
                        className="w-full text-[11px] text-on-surface-variant px-2.5 py-1.5 border border-outline-variant rounded bg-white outline-none"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shared Resources */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-3.5">
                <h3 className="text-sm font-bold text-on-surface flex items-center gap-2 font-poppins">
                  <FiBookOpen className="text-primary" size={16} /> Shared Resources Published
                </h3>
                {isEditingProfile && (
                  <Button type="button" onClick={handleAddResource} variant="outline" size="sm" className="gap-1 text-xs py-1 px-2.5">
                    <FiPlus size={13} /> Add
                  </Button>
                )}
              </div>
              
              {!isEditingProfile ? (
                (user.sharedResources && user.sharedResources.length > 0) ? (
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
                )
              ) : (
                <div className="space-y-3">
                  {editResources.map((res, idx) => (
                    <div key={res.id || idx} className="p-3 bg-surface border border-outline-variant rounded-xl flex items-center justify-between gap-3">
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={res.title}
                          onChange={(e) => {
                            const updated = [...editResources];
                            updated[idx].title = e.target.value;
                            setEditResources(updated);
                          }}
                          placeholder="Resource Title"
                          className="w-full text-xs font-bold text-on-surface px-2.5 py-1.5 border border-outline-variant rounded bg-white outline-none"
                        />
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-on-surface-variant font-medium">Category:</span>
                          <input
                            type="text"
                            value={res.category}
                            onChange={(e) => {
                              const updated = [...editResources];
                              updated[idx].category = e.target.value;
                              setEditResources(updated);
                            }}
                            placeholder="Category"
                            className="text-[10px] text-on-surface-variant px-2 py-0.5 border border-outline-variant rounded bg-white w-28 outline-none"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveResource(idx)}
                        className="text-on-surface-variant hover:text-error p-1 shrink-0 rounded"
                        title="Delete Resource"
                      >
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
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
