import React from 'react';
import Card from '../../../components/common/Card';
import { FiDownload, FiFileText, FiAward } from 'react-icons/fi';

const PlacementReportsTab = () => {
  const departments = [
    { name: 'Computer Science', rate: 94, averageStipend: '$8,200/Mo' },
    { name: 'Electrical Engineering', rate: 86, averageStipend: '$7,100/Mo' },
    { name: 'Information Technology', rate: 89, averageStipend: '$7,400/Mo' },
    { name: 'Data Science', rate: 91, averageStipend: '$7,900/Mo' }
  ];

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Placement Rate by Branch Card */}
        <Card>
          <h3 className="text-sm font-bold text-on-surface mb-5">Hiring Ratios by Branch</h3>
          <div className="space-y-4">
            {departments.map((dept, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                  <span>{dept.name}</span>
                  <span className="text-primary font-bold">{dept.rate}% Hired</span>
                </div>
                <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full" 
                    style={{ width: `${dept.rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Corporate Recruiters */}
        <Card className="flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-on-surface mb-4">Top Sourcing Partners this Term</h3>
            <div className="divide-y divide-outline-variant">
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">💳</span>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Stripe</h4>
                    <p className="text-[10px] text-on-surface-variant font-semibold">6 Candidates Placed</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">$9,500 Average</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">☁️</span>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Amazon Web Services</h4>
                    <p className="text-[10px] text-on-surface-variant font-semibold">4 Candidates Placed</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">$8,800 Average</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base select-none">⚡</span>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">Vercel</h4>
                    <p className="text-[10px] text-on-surface-variant font-semibold">3 Candidates Placed</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-primary">$9,200 Average</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PlacementReportsTab;
