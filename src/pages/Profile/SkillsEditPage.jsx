import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const SkillsEditPage = () => {
  const { user, updateProfile } = useApp();
  const navigate = useNavigate();

  const [skillInput, setSkillInput] = useState('');
  const [tempSkills, setTempSkills] = useState([...(user.skills || [])]);
  const [skillsError, setSkillsError] = useState('');

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

  const handleAddSkillKeyDown = (e) => {
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
    navigate('/profile');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 text-left">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Edit Skills</h2>
          <p className="text-xs text-on-surface-variant">Manage your professional skills index. Add or edit your skills below.</p>
        </div>

        <Card className="bg-white p-6 border border-outline-variant shadow-sm">
          <form onSubmit={handleSaveSkills} className="space-y-6">
            
            {/* Input with info */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="skill-tag-input" className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                Add Skill
              </label>
              <div className="flex gap-2 w-full">
                <input
                  id="skill-tag-input"
                  type="text"
                  placeholder="Type skill name (e.g. React) and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleAddSkillKeyDown}
                  className="flex-1 min-w-0 text-sm rounded-lg py-2.5 px-4 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-on-surface font-sans"
                />
                <Button 
                  type="button"
                  onClick={handleAddSkillClick}
                  variant="primary" 
                  size="sm"
                  className="shrink-0 font-bold px-4 flex items-center gap-1"
                >
                  <FiPlus size={16} />
                  <span>Add Skill</span>
                </Button>
              </div>
              <span className="text-[10px] text-on-surface-variant/85 italic">
                Press Enter or click Add Skill to create tag. Click any tag to edit it. Maximum of 20 skills.
              </span>
            </div>

            {/* Error alerts */}
            {skillsError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-semibold">
                <FiAlertCircle size={15} className="shrink-0" />
                <span>{skillsError}</span>
              </div>
            )}

            {/* Current Tags List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Current Skills ({tempSkills.length}/20)</span>
              <div className="flex flex-wrap gap-2 p-4 min-h-[100px] bg-surface rounded-xl border border-outline-variant/60">
                {tempSkills.length === 0 ? (
                  <span className="text-xs text-on-surface-variant italic m-auto select-none">No skills added yet.</span>
                ) : (
                  tempSkills.map((skill, idx) => (
                    <motion.span 
                      key={idx} 
                      onClick={() => handleEditSkill(idx)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#eff6ff] text-[#1e40af] border border-primary/20 cursor-pointer select-none group transition-all hover:bg-primary hover:text-white duration-150 animate-fade-in"
                      title="Click to edit"
                    >
                      <span>{skill.name}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSkill(idx);
                        }}
                        className="text-[#1e40af] hover:text-error rounded-full p-0.5 group-hover:text-white transition-colors cursor-pointer"
                        title="Remove Skill"
                      >
                        <FiX size={10} />
                      </button>
                    </motion.span>
                  ))
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
              <Button type="button" onClick={() => navigate('/profile')} variant="outline" size="sm">
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm">
                Save Skills
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SkillsEditPage;
