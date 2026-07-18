import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiX, FiAlertCircle, FiPlus } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const InterestsEditPage = () => {
  const { user, updateProfile } = useApp();
  const navigate = useNavigate();

  const [interestInput, setInterestInput] = useState('');
  const [tempInterests, setTempInterests] = useState([...(user.interests || [])]);
  const [interestsError, setInterestsError] = useState('');

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

  const handleAddInterestKeyDown = (e) => {
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
    navigate('/profile');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6 text-left">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Edit Academic Interests</h2>
          <p className="text-xs text-on-surface-variant">Update your academic and professional interests index.</p>
        </div>

        <Card className="bg-white p-6 border border-outline-variant shadow-sm">
          <form onSubmit={handleSaveInterests} className="space-y-6">
            
            {/* Input with info */}
            <div className="flex flex-col gap-2 w-full">
              <label htmlFor="interest-tag-input" className="text-xs font-bold text-on-surface-variant uppercase tracking-wide">
                Add Interest
              </label>
              <div className="flex gap-2 w-full">
                <input
                  id="interest-tag-input"
                  type="text"
                  placeholder="Type interest name (e.g. Hackathons) and press Enter"
                  value={interestInput}
                  onChange={(e) => setInterestInput(e.target.value)}
                  onKeyDown={handleAddInterestKeyDown}
                  className="flex-1 min-w-0 text-sm rounded-lg py-2.5 px-4 bg-white border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-on-surface font-sans"
                />
                <Button 
                  type="button"
                  onClick={handleAddInterestClick}
                  variant="primary" 
                  size="sm"
                  className="shrink-0 font-bold px-4 flex items-center gap-1"
                >
                  <FiPlus size={16} />
                  <span>Add Interest</span>
                </Button>
              </div>
              <span className="text-[10px] text-on-surface-variant/85 italic">
                Press Enter or click Add Interest to create tag. Click any tag to edit it. Maximum of 20 interests.
              </span>
            </div>

            {/* Error alerts */}
            {interestsError && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-error/10 border border-error/20 text-error text-xs font-semibold">
                <FiAlertCircle size={15} className="shrink-0" />
                <span>{interestsError}</span>
              </div>
            )}

            {/* Current Tags List */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-on-surface uppercase tracking-wider">Current Interests ({tempInterests.length}/20)</span>
              <div className="flex flex-wrap gap-2 p-4 min-h-[100px] bg-surface rounded-xl border border-outline-variant/60">
                {tempInterests.length === 0 ? (
                  <span className="text-xs text-on-surface-variant italic m-auto select-none">No interests added yet.</span>
                ) : (
                  tempInterests.map((interest, idx) => (
                    <motion.span 
                      key={idx} 
                      onClick={() => handleEditInterest(idx)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-surface border border-outline-variant text-on-surface-variant cursor-pointer select-none group transition-all hover:bg-primary hover:text-white duration-150 animate-fade-in"
                      title="Click to edit"
                    >
                      <span>{interest}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveInterest(idx);
                        }}
                        className="text-on-surface-variant hover:text-error rounded-full p-0.5 group-hover:text-white transition-colors cursor-pointer"
                        title="Remove Interest"
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
                Save Interests
              </Button>
            </div>

          </form>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default InterestsEditPage;
