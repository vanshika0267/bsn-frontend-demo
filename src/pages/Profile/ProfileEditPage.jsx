import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import { FiUser } from 'react-icons/fi';
import { updateProfile as apiUpdateProfile } from '../../services/api';

const ProfileEditPage = () => {
  const { user, updateProfile } = useApp();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(user.name);
  const [editHeadline, setEditHeadline] = useState(user.headline || '');
  const [editBio, setEditBio] = useState(user.bio || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      // Persist the real fields to the backend (name + bio).
      await apiUpdateProfile(user.id, { name: editName, bio: editBio });
      // Keep local UI in sync (headline is a display-only field).
      updateProfile({ name: editName, headline: editHeadline, bio: editBio });
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 text-left">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Edit Profile Details</h2>
          <p className="text-xs text-on-surface-variant">Update your public name, headline, and bio introduction.</p>
        </div>

        <Card className="bg-white p-6 border border-outline-variant shadow-sm">
          <form onSubmit={handleSaveProfile} className="space-y-5">
            {error && (
              <div className="px-4 py-2 rounded-lg bg-red-500/10 text-red-500 text-xs font-medium">{error}</div>
            )}
            <InputField
              label="Full Name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              required
              id="edit-name"
              placeholder="e.g. Alex Rivera"
            />
            
            <InputField
              label="Headline"
              value={editHeadline}
              onChange={(e) => setEditHeadline(e.target.value)}
              required
              id="edit-headline"
              placeholder="e.g. Computer Science Undergrad | Full-Stack Developer"
            />

            <div className="flex flex-col gap-1.5 w-full">
              <label htmlFor="edit-bio" className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                Bio Description
              </label>
              <textarea
                id="edit-bio"
                rows={6}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="Write a brief introduction about yourself, your goals, and interests..."
                className="w-full text-body-md rounded-lg py-2.5 px-4 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-on-surface font-sans"
              />
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button type="button" onClick={() => navigate('/profile')} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" disabled={saving}>
                {saving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default ProfileEditPage;
