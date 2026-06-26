import React from 'react';
import Card from '../../../components/common/Card';
import { FiTrendingUp, FiUserCheck, FiBriefcase, FiUsers } from 'react-icons/fi';

const HiringAnalyticsTab = () => {
  const metrics = [
    { title: 'Total Sourced', value: '142', change: '+24% this month', icon: FiUsers },
    { title: 'Interview Conversion', value: '18.4%', change: '+2.1% improvement', icon: FiTrendingUp },
    { title: 'Offer Acceptance', value: '92%', change: 'Highly Competitive', icon: FiUserCheck },
    { title: 'Avg Time-to-Hire', value: '14 Days', change: '5 days faster', icon: FiBriefcase }
  ];

  const funnel = [
    { stage: 'Applications Received', count: 142, pct: 100 },
    { stage: 'Vetted Project Score Checks', count: 96, pct: 67 },
    { stage: 'Initial Interviews', count: 48, pct: 33 },
    { stage: 'Technical Code Pairings', count: 18, pct: 12 },
    { stage: 'Offers Extended', count: 6, pct: 4 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Hiring Analytics</h2>
        <p className="text-xs text-on-surface-variant">Measure recruitment velocities, conversion funnels, and verification score correlation index.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <Card key={idx} className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">{m.title}</span>
                <h3 className="text-2xl font-black text-on-surface font-poppins">{m.value}</h3>
                <span className="text-[10px] text-primary font-semibold mt-1 block">{m.change}</span>
              </div>
              <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
                <Icon size={18} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Funnel chart using tailwind flex/widths */}
      <Card>
        <h3 className="text-sm font-bold text-on-surface mb-5">Hiring Funnel Conversion Efficiency</h3>
        <div className="space-y-4">
          {funnel.map((item, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-44 text-xs font-bold text-on-surface-variant shrink-0">{item.stage}</span>
              <div className="flex-1 bg-surface-container rounded-lg h-7 overflow-hidden relative">
                <div 
                  className="bg-primary-container h-full rounded-lg transition-all duration-500"
                  style={{ width: `${item.pct}%` }}
                ></div>
                <span className="absolute inset-y-0 left-3 flex items-center text-[10px] font-bold text-white">
                  {item.count} Candidates ({item.pct}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default HiringAnalyticsTab;
