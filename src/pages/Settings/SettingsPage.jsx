import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUser, FiBell, FiEye, FiLock, FiMonitor, FiCheckCircle } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { useRole } from '../../context/RoleContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/common/Button';
import InputField from '../../components/common/InputField';
import Checkbox from '../../components/common/Checkbox';
import Select from '../../components/common/Select';
import Badge from '../../components/common/Badge';

const SettingsPage = () => {
  const { user, updateProfile, settings, updateSettings } = useApp();
  const { settingsTabs } = useRole();
  
  // Default to the first available tab for the active role
  const [activeTab, setActiveTab] = useState(settingsTabs[0]?.id || 'profile');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync active tab when role changes
  useEffect(() => {
    if (settingsTabs && settingsTabs.length > 0) {
      setActiveTab(settingsTabs[0].id);
    }
  }, [settingsTabs]);

  // Form states
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [college, setCollege] = useState(user.college);
  
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleProfileSave = (e) => {
    e.preventDefault();
    updateProfile({ name, email, college });
    triggerSuccess();
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    setPassword('');
    setNewPassword('');
    triggerSuccess();
  };

  const triggerSuccess = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const getIcon = (id) => {
    switch (id) {
      case 'profile': return FiUser;
      case 'account': return FiLock;
      case 'notifications': return FiBell;
      case 'privacy': return FiEye;
      case 'appearance': return FiMonitor;
      default: return FiUser;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-poppins text-on-surface">System Settings</h1>
            <p className="text-xs text-on-surface-variant">Manage your profile identities, password security, notification alarms and persona displays.</p>
          </div>
          
          {/* Animated Save Success Banner */}
          <AnimatePresence>
            {saveSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 20 }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#eff6ff] border border-primary/20 text-[#1e40af] text-xs font-semibold"
              >
                <FiCheckCircle size={15} />
                <span>Settings Saved!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Outer Split Layout: Sidebar Tabs Left, Content Right */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Left: Tab Selectors */}
          <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col overflow-x-auto md:overflow-x-visible gap-1.5 pb-2 md:pb-0 no-scrollbar">
            {settingsTabs.map((tab) => {
              const Icon = getIcon(tab.id);
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-lg text-xs font-bold transition-all whitespace-nowrap text-left shrink-0 md:shrink-1 ${
                    isActive 
                      ? 'bg-[#eff6ff] text-[#1e40af] border-l-4 border-primary pl-2.5' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container border-l-4 border-transparent'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </div>

          {/* Right: Tab Contents */}
          <div className="flex-1 w-full bg-white p-6 rounded-xl border border-outline-variant min-h-[400px] shadow-sm">
            <AnimatePresence mode="wait">
              
              {/* Profile settings tab */}
              {activeTab === 'profile' && (
                <motion.form
                  key="profile"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onSubmit={handleProfileSave}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Profile Identity</h3>
                  
                  <InputField
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    id="sett-name"
                  />
                  
                  <InputField
                    label="College Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="sett-email"
                  />

                  <InputField
                    label="Active College / Institution"
                    value={college}
                    onChange={(e) => setCollege(e.target.value)}
                    required
                    id="sett-college"
                  />

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Save Profile Settings
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Password tab */}
              {activeTab === 'account' && (
                <motion.form
                  key="account"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onSubmit={handlePasswordSave}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Change Password</h3>
                  
                  <InputField
                    label="Current Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    id="sett-pass"
                  />
                  
                  <InputField
                    label="New Secure Password"
                    type="password"
                    placeholder="••••••••"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    id="sett-newpass"
                  />

                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Update Secure Password
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Privacy settings */}
              {activeTab === 'privacy' && (
                <motion.div
                  key="privacy"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-5"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Privacy Control</h3>
                  
                  <Select
                    label="Profile Visibility"
                    options={[
                      { value: 'public', label: 'Public (Visible to everyone & search engines)' },
                      { value: 'network', label: 'Network Only (Visible to logged-in students & recruiters)' },
                      { value: 'private', label: 'Private (Visible only to you)' }
                    ]}
                    value={settings.profileVisibility}
                    onChange={(e) => {
                      updateSettings('profileVisibility', e.target.value);
                      triggerSuccess();
                    }}
                    id="sett-visibility"
                  />

                  <div className="space-y-3 pt-2">
                    <Checkbox
                      label="Show my impact ranking score in public leaderboards"
                      checked={settings.profileVisibility !== 'private'}
                      onChange={() => triggerSuccess()}
                      id="sett-allow-rank"
                    />
                    <Checkbox
                      label="Allow recruiters to download my academic portfolio files directly"
                      checked={true}
                      onChange={() => triggerSuccess()}
                      id="sett-allow-downloads"
                    />
                  </div>
                </motion.div>
              )}

              {/* Notifications settings */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Notification Preferences</h3>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">Email Alerts</h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">Send summarized notifications to your registered college email.</p>
                      </div>
                      <Checkbox
                        checked={settings.emailNotifications}
                        onChange={(e) => {
                          updateSettings('emailNotifications', e.target.checked);
                          triggerSuccess();
                        }}
                        id="sett-notif-email"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4 pt-2 border-t border-outline-variant">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">Opportunity Alarms</h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">Notify when hackathons or internships matching my skill indices open.</p>
                      </div>
                      <Checkbox
                        checked={settings.opportunityAlerts}
                        onChange={(e) => {
                          updateSettings('opportunityAlerts', e.target.checked);
                          triggerSuccess();
                        }}
                        id="sett-notif-opp"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4 pt-2 border-t border-outline-variant">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">Rank Updates</h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">Alert me when downloads to my files changes my rank status on BSN.</p>
                      </div>
                      <Checkbox
                        checked={settings.rankUpdates}
                        onChange={(e) => {
                          updateSettings('rankUpdates', e.target.checked);
                          triggerSuccess();
                        }}
                        id="sett-notif-rank"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Appearance Preferences</h3>
                  
                  <div className="space-y-4 pt-2">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">Dark Mode (SaaS Premium Dark Theme)</h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">Enable modern slate-dark backdrop style with glass panels.</p>
                      </div>
                      <Checkbox
                        checked={settings.darkMode}
                        onChange={(e) => {
                          updateSettings('darkMode', e.target.checked);
                          triggerSuccess();
                        }}
                        id="sett-theme-dark"
                      />
                    </div>

                    <div className="flex items-start justify-between gap-4 pt-2 border-t border-outline-variant">
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">Reduce Motion / Micro-animations</h4>
                        <p className="text-[11px] text-on-surface-variant leading-relaxed">Turn off sliding dashboard layouts or dropdown effects.</p>
                      </div>
                      <Checkbox
                        checked={false}
                        onChange={() => triggerSuccess()}
                        id="sett-theme-motion"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Senior Availability & Scheduling Tab */}
              {activeTab === 'scheduling' && (
                <motion.form
                  key="scheduling"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onSubmit={(e) => { e.preventDefault(); triggerSuccess(); }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Availability & Calendar Scheduling</h3>
                  
                  <Select
                    label="Default Consultation Call Duration"
                    options={[
                      { value: '30', label: '30 Minutes' },
                      { value: '60', label: '60 Minutes (1 Hour)' },
                      { value: '90', label: '90 Minutes' }
                    ]}
                    value="60"
                    onChange={() => triggerSuccess()}
                    id="sett-sched-dur"
                  />
                  
                  <div className="space-y-2.5">
                    <label className="text-xs font-bold text-on-surface-variant block">Weekly Open Availability Days</label>
                    <div className="flex flex-wrap gap-4">
                      <Checkbox label="Monday" checked={true} onChange={() => triggerSuccess()} id="sched-mon" />
                      <Checkbox label="Wednesday" checked={true} onChange={() => triggerSuccess()} id="sched-wed" />
                      <Checkbox label="Friday" checked={true} onChange={() => triggerSuccess()} id="sched-fri" />
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Save Scheduling Availability
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Recruiter Company Settings Tab */}
              {activeTab === 'company' && (
                <motion.form
                  key="company"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onSubmit={(e) => { e.preventDefault(); triggerSuccess(); }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Corporate Profile Details</h3>
                  
                  <InputField 
                    label="Company Name" 
                    value="Stripe Inc." 
                    onChange={() => {}} 
                    required 
                    id="sett-comp-name" 
                  />
                  
                  <InputField 
                    label="HQ Location" 
                    value="San Francisco, CA" 
                    onChange={() => {}} 
                    required 
                    id="sett-comp-hq" 
                  />
                  
                  <InputField 
                    label="Corporate Sourcing Domain" 
                    value="stripe.com" 
                    onChange={() => {}} 
                    required 
                    id="sett-comp-domain" 
                    disabled 
                  />
                  
                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Save Corporate Profile
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Recruiter Smart Filtering Tab */}
              {activeTab === 'hiring-filters' && (
                <motion.div
                  key="hiring-filters"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Smart Sourcing Filters</h3>
                  
                  <div className="space-y-3 pt-2">
                    <Checkbox 
                      label="Only match candidates with a verified project score > 750" 
                      checked={true} 
                      onChange={() => triggerSuccess()} 
                      id="filt-score" 
                    />
                    <Checkbox 
                      label="Require institutions email to be whitelisted under domain registry" 
                      checked={true} 
                      onChange={() => triggerSuccess()} 
                      id="filt-whitelist" 
                    />
                    <Checkbox 
                      label="Auto-screen resumes using Stitch AI Vetting Agent" 
                      checked={false} 
                      onChange={() => triggerSuccess()} 
                      id="filt-ai-screen" 
                    />
                  </div>
                </motion.div>
              )}

              {/* College Admin Domain Verification rules */}
              {activeTab === 'verification-rules' && (
                <motion.form
                  key="verification-rules"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onSubmit={(e) => { e.preventDefault(); triggerSuccess(); }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Institution Enrollment Domain Rules</h3>
                  
                  <InputField 
                    label="Primary Email Domain" 
                    value="mit.edu" 
                    onChange={() => {}} 
                    required 
                    id="sett-inst-domain" 
                  />
                  
                  <Select
                    label="Enrollment Verification Agent Strategy"
                    options={[
                      { value: 'ldap', label: 'College LDAP Directory Server Sync' },
                      { value: 'email', label: 'Domain Email Verification OTP' },
                      { value: 'manual', label: 'Manual Registrar Uploads only' }
                    ]}
                    value="email"
                    onChange={() => triggerSuccess()}
                    id="sett-inst-strat"
                  />
                  
                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Save Domain Policies
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* College Admin Faculty access roster */}
              {activeTab === 'faculty' && (
                <motion.div
                  key="faculty"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Faculty Staff Accounts</h3>
                  
                  <div className="divide-y divide-outline-variant">
                    <div className="py-2.5 flex items-center justify-between text-xs font-semibold">
                      <div>
                        <p className="text-on-surface">Dr. Sarah Jenkins</p>
                        <p className="text-[10px] text-on-surface-variant">Registrar Office (Primary)</p>
                      </div>
                      <Badge variant="primary">Admin Owner</Badge>
                    </div>
                    <div className="py-2.5 flex items-center justify-between text-xs font-semibold">
                      <div>
                        <p className="text-on-surface">Prof. James Vance</p>
                        <p className="text-[10px] text-on-surface-variant">Computer Science Placement Officer</p>
                      </div>
                      <Badge variant="primary">Staff Coordinator</Badge>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Platform Admin scoring rules */}
              {activeTab === 'scoring-rules' && (
                <motion.form
                  key="scoring-rules"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  onSubmit={(e) => { e.preventDefault(); triggerSuccess(); }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Global System Scoring Multipliers</h3>
                  
                  <InputField 
                    label="Standard Resource Download Points" 
                    type="number" 
                    value="10" 
                    onChange={() => {}} 
                    required 
                    id="sett-mult-dl" 
                  />
                  
                  <InputField 
                    label="Verified Project Badge Points" 
                    type="number" 
                    value="150" 
                    onChange={() => {}} 
                    required 
                    id="sett-mult-badge" 
                  />
                  
                  <InputField 
                    label="Junior Doubt Answer Points" 
                    type="number" 
                    value="25" 
                    onChange={() => {}} 
                    required 
                    id="sett-mult-doubt" 
                  />
                  
                  <div className="pt-2">
                    <Button type="submit" variant="primary" size="sm">
                      Save Multipliers
                    </Button>
                  </div>
                </motion.form>
              )}

              {/* Platform Admin Backups list */}
              {activeTab === 'system-backups' && (
                <motion.div
                  key="system-backups"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="space-y-4"
                >
                  <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">Database Backup Ledgers</h3>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-surface rounded-lg border border-outline-variant flex items-center justify-between text-xs font-semibold">
                      <div>
                        <p className="text-on-surface font-bold">Weekly DB Snapshot (Full ledger postgres)</p>
                        <p className="text-[10px] text-on-surface-variant font-mono">MIT-AWS-LEDGER-06-21.sql</p>
                      </div>
                      <span className="text-[10px] text-success">Completed (2.4 GB)</span>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
