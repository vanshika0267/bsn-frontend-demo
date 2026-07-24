import React from 'react';
import EmptyState from '../../../components/common/EmptyState';
import { FiShield } from 'react-icons/fi';

const SystemReportsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Plagiarism & System Integrity Audits</h2>
        <p className="text-xs text-on-surface-variant">Monitor background duplicate scan triggers, ledger consistency checks, and transaction logs.</p>
      </div>

      <EmptyState
        icon={FiShield}
        title="No audit logs yet"
        description="Integrity scans, similarity checks, and system audit entries will appear here once activity is recorded."
      />
    </div>
  );
};

export default SystemReportsTab;
