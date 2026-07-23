import React from 'react';
import Card from '../../../components/common/Card';
import { FiTrendingUp, FiUserCheck, FiBriefcase, FiUsers } from 'react-icons/fi';

const HiringAnalyticsTab = () => {
  const metrics = [];
  const funnel = [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Hiring Analytics</h2>
        <p className="text-xs text-on-surface-variant">Measure recruitment velocities, conversion funnels, and verification score correlation index.</p>
      </div>

      <Card className="py-14 text-center border-dashed">
        <h3 className="text-sm font-bold text-on-surface mb-2">Hiring analytics are not available yet</h3>
        <p className="text-xs text-on-surface-variant">This section will display real recruitment metrics once data has been synchronized from the backend.</p>
      </Card>
    </div>
  );
};

export default HiringAnalyticsTab;
