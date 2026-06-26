import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import InputField from '../../../components/common/InputField';
import Modal from '../../../components/common/Modal';
import { FiPlus, FiGrid } from 'react-icons/fi';

const CollegeManagementTab = () => {
  const [colleges, setColleges] = useState([
    { id: 'col_1', name: 'Massachusetts Institute of Technology', domain: 'mit.edu', verifiedCount: 412 },
    { id: 'col_2', name: 'Stanford University', domain: 'stanford.edu', verifiedCount: 384 },
    { id: 'col_3', name: 'Harvard University', domain: 'harvard.edu', verifiedCount: 198 }
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', domain: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newCol = {
      id: `col_${colleges.length + 1}`,
      name: form.name,
      domain: form.domain,
      verifiedCount: 0
    };
    setColleges([...colleges, newCol]);
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

      <Table 
        headers={['Institution', 'Domain Whitelist', 'Verified Accounts', 'Status']}
        data={colleges}
        renderRow={(col) => (
          <tr key={col.id} className="hover:bg-surface transition-colors">
            <td className="px-6 py-4">
              <div className="flex items-center gap-2">
                <FiGrid className="text-primary shrink-0" size={16} />
                <span className="font-bold text-on-surface">{col.name}</span>
              </div>
            </td>
            <td className="px-6 py-4">
              <code className="text-xs bg-surface px-2 py-1 rounded border border-outline-variant font-mono text-primary font-bold">
                @{col.domain}
              </code>
            </td>
            <td className="px-6 py-4 font-bold">{col.verifiedCount} Students</td>
            <td className="px-6 py-4">
              <Badge variant="success">Whitelisted</Badge>
            </td>
          </tr>
        )}
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
