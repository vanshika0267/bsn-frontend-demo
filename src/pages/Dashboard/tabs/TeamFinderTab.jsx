import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import { listTeams, createTeam, joinTeam, getTeamMembers } from '../../../services/api';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import InputField from '../../../components/common/InputField';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/common/Modal';
import EmptyState from '../../../components/common/EmptyState';
import {
  FiUsers, FiUserPlus, FiPlusCircle, FiCheckCircle, FiZap,
  FiMail, FiAlertCircle, FiLoader, FiRefreshCw
} from 'react-icons/fi';

// Modular Component: Team Card
const TeamCard = ({ team, onJoin, onViewMembers, isCreator, isJoining }) => {
  const skills = Array.isArray(team.required_skills) ? team.required_skills : [];
  return (
    <Card hoverable={true} className="flex flex-col justify-between bg-white text-left p-5 border border-outline-variant h-full shadow-sm relative overflow-hidden">
      <div className="space-y-4">
        {/* Header */}
        <div>
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-sm font-extrabold text-on-surface line-clamp-1 leading-snug font-poppins">{team.team_name}</h3>
            {isCreator ? (
              <span className="text-xs font-bold text-success flex items-center gap-1 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg">
                <FiCheckCircle size={14} />
                <span>Your Team</span>
              </span>
            ) : (
              <Badge variant="primary">Recruiting</Badge>
            )}
          </div>
          <p className="text-[10px] text-on-surface-variant font-bold uppercase mt-1">
            Created by {team.created_by || 'Unknown'}
          </p>
        </div>

        {/* Required Skills */}
        <div className="space-y-1.5">
          <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Required Skills</span>
          <div className="flex flex-wrap gap-1">
            {skills.length === 0 ? (
              <span className="text-[10px] text-on-surface-variant italic">No skills specified</span>
            ) : (
              skills.map(skill => (
                <span key={skill} className="text-[9px] bg-surface border border-outline-variant text-on-surface-variant px-2.5 py-0.5 rounded font-bold uppercase">
                  {skill}
                </span>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-outline-variant pt-3.5 mt-5 flex justify-between items-center mt-auto">
        <div className="flex items-center text-xs text-on-surface-variant font-medium gap-1">
          <FiUsers className="text-on-surface-variant" size={14} />
          <span>{team.member_count ?? 0} members</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewMembers(team)}
            className="text-xs font-bold text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            title="View members"
          >
            View members
          </button>
          {isCreator ? (
            <span className="text-xs font-bold text-success flex items-center gap-1">
              <FiCheckCircle size={14} />
              <span>Owner</span>
            </span>
          ) : (
            <Button variant="outline" size="sm" className="flex items-center gap-1 py-1" onClick={() => onJoin(team.id)} disabled={isJoining}>
              {isJoining ? <FiLoader size={13} className="animate-spin" /> : <FiUserPlus size={13} />}
              <span>Join</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const TeamFinderTab = () => {
  const { user } = useApp();

  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Create modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', skills: '' });
  const [errors, setErrors] = useState({});
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Recommendations modal (shown after create)
  const [isRecoModalOpen, setIsRecoModalOpen] = useState(false);
  const [recommended, setRecommended] = useState([]);
  const [createdTeamName, setCreatedTeamName] = useState('');

  // Members modal
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);
  const [membersError, setMembersError] = useState('');
  const [membersData, setMembersData] = useState(null);

  // Join state + toast
  const [joiningId, setJoiningId] = useState(null);
  const [toast, setToast] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const loadTeams = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listTeams();
      setTeams(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e.message || 'Failed to load teams');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleJoinTeam = async (id) => {
    setJoiningId(id);
    try {
      await joinTeam(id);
      showToast('You joined the team!');
      await loadTeams();
    } catch (e) {
      showToast(e.message || 'Failed to join team');
    } finally {
      setJoiningId(null);
    }
  };

  const handleViewMembers = async (team) => {
    setIsMembersModalOpen(true);
    setMembersLoading(true);
    setMembersError('');
    setMembersData(null);
    try {
      const data = await getTeamMembers(team.id);
      setMembersData(data);
    } catch (e) {
      setMembersError(e.message || 'Failed to load members');
    } finally {
      setMembersLoading(false);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Team name is required';
    if (!form.skills.trim()) newErrors.skills = 'Please specify at least one skill';
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setCreateError('');
    setCreating(true);

    const skillsArray = form.skills.split(',').map(s => s.trim()).filter(Boolean);
    try {
      const result = await createTeam(form.name.trim(), skillsArray);
      setIsCreateModalOpen(false);
      setForm({ name: '', skills: '' });
      // Show recommended teammates returned by the API
      setRecommended(Array.isArray(result?.recommended_teammates) ? result.recommended_teammates : []);
      setCreatedTeamName(result?.team_name || form.name.trim());
      setIsRecoModalOpen(true);
      await loadTeams();
    } catch (err) {
      setCreateError(err.message || 'Failed to create team');
    } finally {
      setCreating(false);
    }
  };

  const q = searchQuery.toLowerCase();
  const filteredTeams = teams.filter(t => {
    const name = (t.team_name || '').toLowerCase();
    const skills = (Array.isArray(t.required_skills) ? t.required_skills : []).join(' ').toLowerCase();
    const creator = (t.created_by || '').toLowerCase();
    return name.includes(q) || skills.includes(q) || creator.includes(q);
  });

  const isMine = (team) =>
    !!user && (team.created_by === user.id || team.created_by === user.name || team.created_by === user.email);

  return (
    <div className="space-y-6 text-left">
      {/* Intro Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-poppins text-on-surface">Alumni & Peer Team Finder</h2>
          </div>
          <p className="text-xs text-on-surface-variant">Form coding groups for hackathons, startup prototypes, or research challenges.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="outline" size="sm" className="flex items-center gap-2" onClick={loadTeams} disabled={loading}>
            <FiRefreshCw size={15} className={loading ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </Button>
          <Button variant="primary" size="sm" className="flex items-center gap-2" onClick={() => { setCreateError(''); setErrors({}); setIsCreateModalOpen(true); }}>
            <FiPlusCircle size={16} />
            <span>Create Team</span>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col lg:flex-row items-center gap-4 shadow-sm">
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams, skills, creators..."
          className="flex-1"
        />
      </div>

      {/* Content states */}
      {loading ? (
        <Card className="p-10 text-center border-dashed flex flex-col items-center justify-center">
          <FiLoader size={28} className="animate-spin text-on-surface-variant mb-3" />
          <p className="text-sm text-on-surface-variant font-semibold">Loading teams...</p>
        </Card>
      ) : error ? (
        <EmptyState
          icon={FiAlertCircle}
          title="Couldn't load teams"
          description={error}
          actionText="Try again"
          onActionClick={loadTeams}
        />
      ) : filteredTeams.length === 0 ? (
        <EmptyState
          icon={FiUsers}
          title={searchQuery ? 'No matching teams' : 'No teams yet'}
          description={searchQuery ? 'Try a different search query.' : 'Be the first to launch a squad and find teammates.'}
          actionText="Create Team"
          onActionClick={() => { setCreateError(''); setErrors({}); setIsCreateModalOpen(true); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredTeams.map((team) => (
            <TeamCard
              key={team.id}
              team={team}
              onJoin={handleJoinTeam}
              onViewMembers={handleViewMembers}
              isCreator={isMine(team)}
              isJoining={joiningId === team.id}
            />
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
            label="Team Name"
            id="name"
            placeholder="e.g. Fintech Hackathon Backend Core"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            error={errors.name}
            required
          />

          <InputField
            label="Required Skills (comma separated)"
            id="skills"
            placeholder="e.g. React, Node.js, Postgres"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            error={errors.skills}
            required
          />

          {createError && (
            <div className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              <FiAlertCircle size={14} />
              <span>{createError}</span>
            </div>
          )}

          <div className="border-t border-outline-variant pt-4 flex justify-end gap-3 mt-6">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsCreateModalOpen(false)} disabled={creating}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={creating} className="flex items-center gap-1.5">
              {creating && <FiLoader size={14} className="animate-spin" />}
              <span>Create Team</span>
            </Button>
          </div>
        </form>
      </Modal>

      {/* Recommended Teammates Modal */}
      <Modal
        isOpen={isRecoModalOpen}
        onClose={() => setIsRecoModalOpen(false)}
        title={`"${createdTeamName}" created!`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant flex items-center gap-2">
            <FiZap className="text-amber-500" size={16} />
            <span>Recommended teammates based on your required skills.</span>
          </p>

          {recommended.length === 0 ? (
            <div className="text-xs text-on-surface-variant italic bg-surface-container border border-outline-variant rounded-lg p-4 text-center">
              No teammate recommendations right now. Your team is live in the list.
            </div>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {recommended.map((r) => (
                <div key={r.user_id} className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">👤</span>
                    <div>
                      <p className="font-bold text-on-surface text-sm leading-tight">{r.user_id}</p>
                      <p className="text-[10px] text-on-surface-variant">
                        {(Array.isArray(r.matched_skills) ? r.matched_skills : []).join(', ') || 'No matched skills'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">{Math.round((r.match_score ?? 0) * (r.match_score <= 1 ? 100 : 1))}% match</Badge>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-outline-variant pt-4 flex justify-end mt-4">
            <Button variant="primary" size="sm" onClick={() => setIsRecoModalOpen(false)}>Done</Button>
          </div>
        </div>
      </Modal>

      {/* Members Modal */}
      <Modal
        isOpen={isMembersModalOpen}
        onClose={() => setIsMembersModalOpen(false)}
        title={membersData?.team_name ? `${membersData.team_name} — Members` : 'Team Members'}
        size="md"
      >
        <div className="space-y-4">
          {membersLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <FiLoader size={24} className="animate-spin text-on-surface-variant mb-2" />
              <p className="text-sm text-on-surface-variant">Loading members...</p>
            </div>
          ) : membersError ? (
            <div className="text-xs text-red-600 flex items-center gap-1.5 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
              <FiAlertCircle size={14} />
              <span>{membersError}</span>
            </div>
          ) : (
            <>
              <p className="text-xs text-on-surface-variant font-bold uppercase">
                {membersData?.total_members ?? (membersData?.members?.length || 0)} members
              </p>
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {(membersData?.members || []).length === 0 ? (
                  <p className="text-xs text-on-surface-variant italic text-center py-4">No members yet.</p>
                ) : (
                  membersData.members.map((m) => (
                    <div key={m.user_id} className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant">
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">👤</span>
                        <div>
                          <p className="font-bold text-on-surface text-sm leading-tight">{m.name || m.user_id}</p>
                          <p className="text-[10px] text-on-surface-variant flex items-center gap-1">
                            <FiMail size={10} /> {m.email || '—'}
                          </p>
                        </div>
                      </div>
                      {m.role && <Badge variant="default">{m.role}</Badge>}
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          <div className="border-t border-outline-variant pt-4 flex justify-end mt-4">
            <Button variant="outline" size="sm" onClick={() => setIsMembersModalOpen(false)}>Close</Button>
          </div>
        </div>
      </Modal>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-green-500 text-white px-5 py-3 rounded-xl flex items-center gap-2.5 shadow-2xl animate-bounce">
          <FiCheckCircle size={18} />
          <span className="text-sm font-semibold">{toast}</span>
        </div>
      )}
    </div>
  );
};

export default TeamFinderTab;
