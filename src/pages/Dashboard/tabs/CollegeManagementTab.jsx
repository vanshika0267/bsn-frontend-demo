import React, { useState } from 'react';
import EmptyState from '../../../components/common/EmptyState';
import InputField from '../../../components/common/InputField';
import Modal from '../../../components/common/Modal';
import { FiPlus, FiGrid } from 'react-icons/fi';

const CollegeManagementTab = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', domain: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsModalOpen(false);
    setForm({ name: '', domain: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Registered Universities Directory</h2>
          <p className="text-xs text-on-surface-variant">Add accredited colleges, whitelist domains, and inspect student enrollment counts.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <FiPlus size={14} /> Whitelist College
        </button>
      </div>

      <EmptyState
        icon={FiGrid}
        title="No colleges registered yet"
        description="Whitelisted institutions and their verified account counts will appear here once colleges are added."
      />

      {isModalOpen && (
        <Modal 
          title="Whitelist College Institution" 
          onClose={() => setIsModalOpen(false)}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField 
              label="College Name"
              placeholder="e.g., Cambridge University"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <InputField 
              label="Email Domain Whitelist"
              placeholder="e.g., cam.ac.uk"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              required
            />
            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-outline-variant hover:bg-surface text-on-surface text-xs font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Save Institution
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default CollegeManagementTab;
