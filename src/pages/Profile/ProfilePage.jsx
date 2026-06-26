import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiEdit, FiMapPin, FiBriefcase, FiLink, FiDownload, FiCheck, 
  FiGithub, FiExternalLink, FiAward, FiStar, FiBookOpen 
} from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';

const ProfilePage = () => {
  const { user, updateProfile } = useApp();
  
  // Edit Profile Modal states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editName, setEditName] = useState(user.name);
  const [editHeadline, setEditHeadline] = useState(user.headline);
  const [editBio, setEditBio] = useState(user.bio);
  
  // Copied alert state
  const [copied, setCopied] = useState(false);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
        {/* Profile Header & Banner Card */}
        <div className="bg-white rounded-xl overflow-hidden border border-outline-variant relative shadow-sm">
          
          {/* Cover Photo */}
          <div className="h-40 sm:h-52 w-full overflow-hidden relative">
            <img 
              src={user.coverBanner} 
              alt="Profile cover banner" 
              className="w-full h-full object-cover filter brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          </div>

          {/* Profile Details Container */}
          <div className="px-5 pb-5 pt-0 relative flex flex-col md:flex-row justify-between items-start md:items-end gap-5">
            {/* Avatar & text details */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end -mt-14 sm:-mt-16 relative z-10">
              <img 
                src={user.profilePicture} 
                alt={user.name} 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover ring-4 ring-white shadow-lg"
              />
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
              <Button onClick={() => setIsEditOpen(true)} variant="secondary" size="sm" className="gap-1.5 py-2 px-3 text-xs">
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
              <h3 className="text-sm font-bold text-on-surface mb-3.5 font-poppins">Verified Skill Index</h3>
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
              <h3 className="text-sm font-bold text-on-surface mb-3 font-poppins">Academic Interests</h3>
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
            
            {/* Github-style projects cards */}
            <div className="bg-white p-5 rounded-xl border border-outline-variant shadow-sm">
              <h3 className="text-sm font-bold text-on-surface mb-4 flex items-center gap-2 font-poppins">
                <FiGithub className="text-on-surface-variant" size={16} /> GitHub & Portfolios Projects
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.projects.map((proj) => (
                  <div key={proj.id} className="p-4 bg-surface rounded-lg border border-outline-variant hover:border-primary transition-colors flex flex-col justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs font-bold text-on-surface line-clamp-1 hover:text-primary cursor-pointer transition-colors">
                          {proj.title}
                        </h4>
                        <div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
                          <FiStar size={10} className="text-on-surface-variant" />
                          <span>{proj.stars}</span>
                        </div>
                      </div>
                      <p className="text-[11px] text-on-surface-variant line-clamp-3 leading-relaxed font-light">
                        {proj.description}
                      </p>
                    </div>

                    <div className="pt-2 flex items-center justify-between gap-2 border-t border-outline-variant">
                      <div className="flex gap-1.5 overflow-hidden">
                        {proj.techStack.slice(0, 2).map((tech, idx) => (
                          <span key={idx} className="text-[9px] font-bold bg-surface-container border border-outline-variant text-on-surface-variant px-1.5 py-0.5 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant">
                          <FiGithub size={12} />
                        </a>
                        <a href={proj.demoUrl} target="_blank" rel="noopener noreferrer" className="p-1 rounded bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors border border-outline-variant">
                          <FiExternalLink size={12} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

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

        {/* Profile Edit Modal */}
        <Modal
          isOpen={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Profile Details"
          size="md"
        >
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <InputField
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              id="edit-name"
            />
            
            <InputField
              label="Headline"
              value={editHeadline}
              onChange={(e) => setEditHeadline(e.target.value)}
              required
              id="edit-headline"
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="edit-bio" className="text-label-md font-label-md text-on-surface-variant">
                Bio Description
              </label>
              <textarea
                id="edit-bio"
                rows={4}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full text-body-md rounded-lg py-2 px-4 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-on-surface"
              />
            </div>

            <div className="flex gap-3 justify-end pt-2 border-t border-outline-variant">
              <Button onClick={() => setIsEditOpen(false)} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Changes
              </Button>
            </div>
          </form>
        </Modal>

      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
