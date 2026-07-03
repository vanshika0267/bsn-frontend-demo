import ProfileHeader from '../components/profile/ProfileHeader';
import SkillsInterests from '../components/profile/SkillsInterests';
import GitHubConnect from '../components/github/GitHubConnect';
import { useApp } from '../context/AppContext';
import { ROLE_META } from '../utils/roleDetection';

export default function ProfilePage() {
  const { user } = useApp();
  const roleMeta = user?.role ? ROLE_META[user.role] : null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-[28px] tracking-tight text-[--color-secondary-navy]">Profile</h1>
          <p className="text-slate-500 text-[14px]">Manage your public BioPay presence</p>
        </div>
        {roleMeta && (
          <div className="text-[12px] px-3 py-1.5 rounded-full" style={{ backgroundColor: roleMeta.bg, color: roleMeta.color }}>
            {roleMeta.icon} {roleMeta.label}
          </div>
        )}
      </div>

      <ProfileHeader />
      <SkillsInterests />
      <GitHubConnect />
    </div>
  );
}
