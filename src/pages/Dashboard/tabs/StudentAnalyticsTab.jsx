import React from 'react';
import EmptyState from '../../../components/common/EmptyState';
import { FiUsers } from 'react-icons/fi';

const StudentAnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Campus Student Analytics</h2>
        <p className="text-xs text-on-surface-variant">Review verification scores, user activity ratios, and placement states across departments.</p>
      </div>

      <EmptyState
        icon={FiUsers}
        title="No student data yet"
        description="Enrollment counts, impact scores, and the student directory will appear here once students join."
      />
    </div>
  );
};

export default StudentAnalyticsTab;
