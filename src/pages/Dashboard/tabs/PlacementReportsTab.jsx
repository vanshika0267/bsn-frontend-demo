import React from 'react';
import EmptyState from '../../../components/common/EmptyState';
import { FiDownload, FiAward } from 'react-icons/fi';

const PlacementReportsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Campus Placement & Hiring Audits</h2>
          <p className="text-xs text-on-surface-variant">Review corporate engagement, average stipends, and export regional recruitment compliance reports.</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors">
          <FiDownload size={14} /> Export CSV
        </button>
      </div>

      <EmptyState
        icon={FiAward}
        title="No placement data yet"
        description="Placement rates, stipends, and recruiter activity will appear here once students are placed."
      />
    </div>
  );
};

export default PlacementReportsTab;
