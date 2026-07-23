import React from 'react';
import EmptyState from '../../../components/common/EmptyState';
import { FiShield } from 'react-icons/fi';

const VerificationRequestsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Verified Academic Badge Queue</h2>
        <p className="text-xs text-on-surface-variant">Review certificates uploaded by students to award the official Verified Profile Badge.</p>
      </div>

      <EmptyState
        icon={FiShield}
        title="No verification requests"
        description="This queue will populate when students request verification for their academic badges and certificates."
      />
    </div>
  );
};

export default VerificationRequestsTab;
