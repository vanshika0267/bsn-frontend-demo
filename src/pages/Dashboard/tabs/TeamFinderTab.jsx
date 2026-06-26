import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import InputField from '../../../components/common/InputField';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/common/Modal';
import { FiUsers, FiUserPlus, FiPlusCircle, FiCheckCircle, FiZap, FiMail } from 'react-icons/fi';

const TeamFinderTab = () => {
  const { teamsList, setTeamsList } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('All');
  
  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinSuccessOpen, setIsJoinSuccessOpen] = useState(false);
  
  // Creation form state
  const [form, setForm] = useState({ name: '', description: '', skills: '', capacity: 4 });
  const [errors, setErrors] = useState({});

  const allSkills = ['All', 'React', 'Node.js', 'Figma', 'Python', 'Tailwind CSS', 'Postgres', 'TypeScript'];

  const handleJoinTeam = (id) => {
    setTeamsList(prev =>
      prev.map(t => {
        if (t.id === id) {
          if (t.status === 'Joined' || t.status === 'Requested') return t;
          return {
            ...t,
            status: 'Requested',
            membersCount: t.membersCount + 1,
            spotsLeft: Math.max(0, t.spotsLeft - 1)
          };
        }
        return t;
      })
    );
    setIsJoinSuccessOpen(true);
    setTimeout(() => setIsJoinSuccessOpen(false), 2000);
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Project name is required';
    if (!form.description.trim() || form.description.length < 15) newErrors.description = 'Description must be at least 15 characters';
    if (!form.skills.trim()) newErrors.skills = 'Please specify at least one skill';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const newTeam = {
      id: Date.now(),
      name: form.name,
      title: form.name,
      description: form.description,
      creator: 'Jane Doe (You)',
      postedBy: 'Jane Doe (You)',
      college: 'Massachusetts Institute of Technology',
      membersCount: 1,
      capacity: Number(form.capacity),
      spotsLeft: Number(form.capacity) - 1,
      skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      rolesNeeded: form.skills.split(',').map(s => s.trim()).filter(Boolean),
      status: 'Joined', // Self-created means joined
      avatar: '👥'
    };

    setTeamsList(prev => [newTeam, ...prev]);
    setIsCreateModalOpen(false);
    setForm({ name: '', description: '', skills: '', capacity: 4 });
    setErrors({});
  };

  const filteredTeams = teamsList.filter(t => {
    const matchesSearch = 
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesSkill = selectedSkill === 'All' || t.skills.some(skill => skill.toLowerCase() === selectedSkill.toLowerCase());

    return matchesSearch && matchesSkill;
  });

  return (
    <div className="space-y-6 text-left">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Alumni & Peer Team Finder</h2>
          <p className="text-xs text-on-surface-variant">Form coding groups for hackathons, startup prototypes, or research challenges.</p>
        </div>
        <Button variant="primary" size="sm" className="flex items-center gap-2 shrink-0" onClick={() => setIsCreateModalOpen(true)}>
          <FiPlusCircle size={16} />
          <span>Launch Squad</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col lg:flex-row items-center gap-4 shadow-sm">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search team squads, projects, keywords..."
          className="flex-1"
        />

        <div className="flex gap-1.5 overflow-x-auto pb-1 lg:pb-0 no-scrollbar w-full lg:w-auto">
          {allSkills.map(s => (
            <button
              key={s}
              onClick={() => setSelectedSkill(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors whitespace-nowrap ${
                selectedSkill === s 
                  ? 'bg-primary-container text-white border-primary' 
                  : 'bg-transparent hover:bg-surface-container text-on-surface-variant border-outline-variant'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Team Cards */}
      {filteredTeams.length === 0 ? (
        <Card className="p-8 text-center border-dashed flex flex-col items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant mb-3 text-lg font-bold">
            👥
          </div>
          <h3 className="text-sm font-bold text-on-surface">No squads found</h3>
          <p className="text-xs text-on-surface-variant mt-1 max-w-sm mx-auto">
            Try resetting your search query or selecting a different skill criteria.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTeams.map((team) => (
            <Card key={team.id} hoverable={true} className="flex flex-col justify-between bg-white text-left">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-sm font-extrabold text-on-surface line-clamp-1 leading-snug">{team.name}</h3>
                    <Badge variant={team.status === 'Joined' ? 'success' : team.status === 'Requested' ? 'warning' : 'primary'}>
                      {team.status === 'Joined' ? 'Active' : team.status === 'Requested' ? 'Pending' : 'Recruiting'}
                    </Badge>
                  </div>
                  <p className="text-[9px] text-on-surface-variant font-bold uppercase mt-1">Created by {team.creator || team.postedBy}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-on-surface-variant font-light line-clamp-3 leading-relaxed min-h-[54px]">
                  {team.description}
                </p>

                {/* Skills required */}
                <div className="space-y-2">
                  <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Required Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {team.skills.map(skill => (
                      <span key={skill} className="text-[10px] bg-surface border border-outline-variant text-on-surface-variant px-2 py-0.5 rounded font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-outline-variant pt-3.5 mt-5 flex justify-between items-center mt-auto">
                <div className="flex items-center text-xs text-on-surface-variant font-medium gap-1">
                  <FiUsers className="text-on-surface-variant" size={14} />
                  <span>{team.membersCount} / {team.capacity} spots</span>
                </div>

                {team.status === 'Joined' ? (
                  <span className="text-xs font-bold text-success flex items-center gap-1">
                    <FiCheckCircle size={14} />
                    <span>Active Squad member</span>
                  </span>
                ) : team.status === 'Requested' ? (
                  <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                    <FiMail size={14} className="animate-pulse" />
                    <span>Request Sent</span>
                  </span>
                ) : (
                  <Button variant="outline" size="sm" className="flex items-center gap-1 py-1" onClick={() => handleJoinTeam(team.id)}>
                    <FiUserPlus size={13} />
                    <span>Ask to Join</span>
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Launch a Project Squad"
        size="md"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <InputField
            label="Project / Squad Name"
            id="name"
            placeholder="e.g. Fintech Hackathon Backend Core"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />

          <InputField
            label="Skills Needed (Comma separated)"
            id="skills"
            placeholder="e.g. React, Node.js, Postgres"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            error={errors.skills}
            required
          />

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-bold text-on-surface tracking-wide uppercase">Squad Capacity</label>
            <select
              value={form.capacity}
              onChange={(e) => setForm({ ...form, capacity: e.target.value })}
              className="px-4 py-2 bg-white border border-outline-variant focus:border-primary rounded-lg text-sm text-on-surface focus:outline-none transition-all cursor-pointer font-semibold"
            >
              {[2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n} Members Max</option>)}
            </select>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="team-desc" className="text-xs font-bold text-on-surface tracking-wide uppercase">Project Idea & Goal</label>
            <textarea
              id="team-desc"
              rows="4"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Describe the problem you want to solve, what technologies you will use, and what roles are open..."
              className={`w-full px-4 py-2 border ${
                errors.description ? 'border-red-500' : 'border-outline-variant focus:border-primary'
              } rounded-lg text-sm text-on-surface placeholder-on-surface-variant focus:outline-none transition-all font-sans`}
              required
            />
            {errors.description && <p className="text-xs text-red-500 mt-0.5">{errors.description}</p>}
          </div>

          <div className="border-t border-outline-variant pt-4 flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Launch Squad
            </Button>
          </div>
        </form>
      </Modal>

      {/* Success Notification overlay */}
      {isJoinSuccessOpen && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 shadow-2xl animate-bounce">
          <FiCheckCircle size={18} />
          <span className="text-sm font-semibold">Join request sent to project leader!</span>
        </div>
      )}
    </div>
  );
};

export default TeamFinderTab;
