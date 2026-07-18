import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiEdit, FiMapPin, FiBriefcase, FiLink, FiDownload, FiCheck, 
  FiGithub, FiExternalLink, FiAward, FiStar, FiBookOpen,
  FiCamera, FiTrash2, FiUpload, FiAlertCircle, FiX
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import GitHubConnect from '../../components/github/GitHubConnect';

const getDefaultAvatar = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'User')}&background=eff6ff&color=1e40af&size=200&bold=true`;

const ProfilePage = () => {
  const { user, updateProfile } = useApp();
  const navigate = useNavigate();
  
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

  // Edit Profile Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editHeadline, setEditHeadline] = useState(user.headline);
  const [editBio, setEditBio] = useState(user.bio);
  
  // Copied alert state
  const [copied, setCopied] = useState(false);

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

    // Validate format
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExtension = ['png', 'jpg', 'jpeg'].includes(fileExtension);
    if (!validTypes.includes(file.type) && !isValidExtension) {
      setCoverError('Unsupported format. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    // Validate size (10 MB)
    if (file.size > 10 * 1024 * 1024) {
      setCoverError('File is too large. Maximum size is 10 MB.');
      return;
    }

    // Show preview
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

    // Validate format
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidExtension = ['png', 'jpg', 'jpeg'].includes(fileExtension);
    if (!validTypes.includes(file.type) && !isValidExtension) {
      setAvatarError('Unsupported format. Please upload a PNG, JPG, or JPEG image.');
      return;
    }

    // Validate size (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('File is too large. Maximum size is 5 MB.');
      return;
    }

    // Show preview
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
    const defaultAv = getDefaultAvatar(user.name);
    setAvatarPreview(defaultAv);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(user.portfolioUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      headline: editHeadline,
      bio: editBio
    });
    setIsEditOpen(false);
  };

  // Skills Modal states & handlers
  const [isSkillsModalOpen, setIsSkillsModalOpen] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [tempSkills, setTempSkills] = useState([]);
  const [skillsError, setSkillsError] = useState('');

  const openSkillsModal = () => {
    setTempSkills([...(user.skills || [])]);
    setSkillInput('');
    setSkillsError('');
    setIsSkillsModalOpen(true);
  };

  const performAddSkill = (value) => {
    const val = value.trim();
    if (!val) return;

    if (tempSkills.some(s => s.name.toLowerCase() === val.toLowerCase())) {
      setSkillsError('This skill is already added.');
      return;
    }

    if (tempSkills.length >= 20) {
      setSkillsError('Maximum limit of 20 skills reached.');
      return;
    }

    setSkillsError('');
    const existing = (user.skills || []).find(s => s.name.toLowerCase() === val.toLowerCase());
    const newSkill = {
      name: val,
      level: existing ? existing.level : 'Intermediate',
      value: existing ? existing.value : 75
    };

    setTempSkills([...tempSkills, newSkill]);
    setSkillInput('');
  };

  const handleAddSkill = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performAddSkill(skillInput);
    }
  };

  const handleAddSkillClick = (e) => {
    e.preventDefault();
    performAddSkill(skillInput);
  };

  const handleRemoveSkill = (index) => {
    setTempSkills(tempSkills.filter((_, i) => i !== index));
    setSkillsError('');
  };

  const handleEditSkill = (index) => {
    const skillToEdit = tempSkills[index];
    setSkillInput(skillToEdit.name);
    setTempSkills(tempSkills.filter((_, i) => i !== index));
    setSkillsError('');
  };

  const handleSaveSkills = (e) => {
    e.preventDefault();
    updateProfile({ skills: tempSkills });
    setIsSkillsModalOpen(false);
  };

  // Interests Modal states & handlers
  const [isInterestsModalOpen, setIsInterestsModalOpen] = useState(false);
  const [interestInput, setInterestInput] = useState('');
  const [tempInterests, setTempInterests] = useState([]);
  const [interestsError, setInterestsError] = useState('');

  const openInterestsModal = () => {
    setTempInterests([...(user.interests || [])]);
    setInterestInput('');
    setInterestsError('');
    setIsInterestsModalOpen(true);
  };

  const performAddInterest = (value) => {
    const val = value.trim();
    if (!val) return;

    if (tempInterests.some(i => i.toLowerCase() === val.toLowerCase())) {
      setInterestsError('This interest is already added.');
      return;
    }

    if (tempInterests.length >= 20) {
      setInterestsError('Maximum limit of 20 interests reached.');
      return;
    }

    setInterestsError('');
    setTempInterests([...tempInterests, val]);
    setInterestInput('');
  };

  const handleAddInterest = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performAddInterest(interestInput);
    }
  };

  const handleAddInterestClick = (e) => {
    e.preventDefault();
    performAddInterest(interestInput);
  };

  const handleRemoveInterest = (index) => {
    setTempInterests(tempInterests.filter((_, i) => i !== index));
    setInterestsError('');
  };

  const handleEditInterest = (index) => {
    const interestToEdit = tempInterests[index];
    setInterestInput(interestToEdit);
    setTempInterests(tempInterests.filter((_, i) => i !== index));
    setInterestsError('');
  };

  const handleSaveInterests = (e) => {
    e.preventDefault();
    updateProfile({ interests: tempInterests });
    setIsInterestsModalOpen(false);
  };


  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Profile Header & Banner Card */}
        <div className="bg-white rounded-xl overflow-hidden border border-outline-variant relative shadow-sm">
          
          {/* Cover Photo */}
          <div className="group/cover h-40 sm:h-52 w-full overflow-hidden relative">
            <img 
              src={user.coverBanner} 
              alt="Profile cover banner" 
              className="w-full h-full object-cover filter brightness-95"
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
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-14 sm:-mt-16 relative z-10">
              <div 
                onClick={openAvatarModal}
                className="group relative cursor-pointer overflow-hidden rounded-xl w-24 h-24 sm:w-28 sm:h-28 ring-4 ring-white shadow-lg shrink-0 transition-transform duration-300 hover:scale-105"
                title="Click to update profile picture"
              >
                <img 
                  src={user.profilePicture} 
                  alt={user.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white gap-1 select-none">
                  <FiCamera size={18} className="animate-pulse" />
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-center px-1">Update Photo</span>
                </div>
              </div>
              <div className="space-y-1">
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
            </div>

            {/* Actions button group */}
            <div className="flex flex-wrap gap-2 w-full md:w-auto relative z-10 shrink-0">
              <Button onClick={() => navigate('/profile/edit')} variant="secondary" size="sm" className="gap-1.5 py-2 px-3 text-xs">
                <FiEdit size={14} /> Edit Profile
              </Button>
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
              <p className="text-xs text-on-surface-variant leading-relaxed font-light whitespace-pre-line">
                {user.bio}
              </p>
            </div>

            {/* Verified Skills with progress rating */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-3.5">
                <h3 className="text-sm font-bold text-on-surface font-poppins">Verified Skill Index</h3>
                <button 
                  onClick={() => navigate('/profile/edit/skills')}
                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary/20"
                  title="Edit Skills"
                >
                  <FiEdit size={14} />
                </button>
              </div>
              <div className="space-y-3.5">
                {user.skills.map((skill, idx) => (
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
                ))}
              </div>
            </div>

            {/* Academic Interests */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-on-surface font-poppins">Academic Interests</h3>
                <button 
                  onClick={() => navigate('/profile/edit/interests')}
                  className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors duration-200 outline-none focus:ring-2 focus:ring-primary/20"
                  title="Edit Interests"
                >
                  <FiEdit size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {user.interests.map((interest, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-surface border border-outline-variant text-on-surface-variant">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column (2/3 cols) - Projects, Experience timeline, Shared Resources */}
          <div className="space-y-6 lg:col-span-2">
            
            {/* Github Connect & Live Repos */}
            <GitHubConnect />

            {/* Achievements Timeline */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2 font-poppins">
                <FiAward className="text-primary" size={16} /> Accomplishments & Awards
              </h3>
              
              <div className="relative pl-5 border-l border-outline-variant space-y-5">
                {user.achievements.map((ach) => (
                  <div key={ach.id} className="relative space-y-1">
                    {/* Time indicator Dot */}
                    <span className="absolute -left-[25.5px] top-1.5 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-white"></span>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wide">{ach.date}</span>
                    <h4 className="text-xs font-bold text-on-surface">{ach.title}</h4>
                    <p className="text-[11px] text-on-surface-variant leading-relaxed font-light">{ach.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Resources */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-3.5 flex items-center gap-2 font-poppins">
                <FiBookOpen className="text-primary" size={16} /> Shared Resources Published
              </h3>
              
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
            
            {/* Avatar Preview & Drop/Click Zone */}
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

            {/* Error alerts */}
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

            {/* Success alerts */}
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

            {/* Selection Options */}
            <div className="flex flex-col gap-2">
              {/* Remove Photo */}
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

            {/* Action Buttons */}
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
                {isAvatarUploading ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Photo'
                )}
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
            
            {/* Cover Banner Preview */}
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

            {/* Drag/Click Zone */}
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

            {/* Error alerts */}
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

            {/* Success alerts */}
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

            {/* Selection Options */}
            <div className="flex flex-col gap-2">
              {/* Remove Cover */}
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

            {/* Action Buttons */}
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
                {isCoverUploading ? (
                  <span className="flex items-center gap-1">
                    <svg className="animate-spin -ml-1 mr-1 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Save Banner'
                )}
              </Button>
            </div>
          </form>
        </Modal>



      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
