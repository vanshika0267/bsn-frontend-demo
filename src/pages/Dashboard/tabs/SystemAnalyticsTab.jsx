import React from 'react';
import Card from '../../../components/common/Card';
import { FiCpu, FiDatabase, FiHardDrive, FiActivity } from 'react-icons/fi';

const SystemAnalyticsTab = () => {
  const diagnostics = [
    { name: 'API Server Response (FastAPI)', value: '38ms', status: 'Optimal', icon: FiActivity, color: 'text-green-600 bg-green-50' },
    { name: 'Database Latency (PostgreSQL)', value: '4.2ms', status: 'Optimal', icon: FiDatabase, color: 'text-green-600 bg-green-50' },
    { name: 'CPU Utilization (AWS EC2)', value: '14.8%', status: 'Low load', icon: FiCpu, color: 'text-green-600 bg-green-50' },
    { name: 'Object Storage Capacity', value: '412.8 GB', status: '12% Used', icon: FiHardDrive, color: 'text-blue-600 bg-blue-50' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Platform Infrastructure Analytics</h2>
        <p className="text-xs text-on-surface-variant">Real-time status tracking of container load, PostgreSQL latency indices, and AWS instance health.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {diagnostics.map((diag, idx) => {
          const Icon = diag.icon;
          return (
            <Card key={idx} className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">{diag.name}</span>
                <h3 className="text-2xl font-black text-on-surface font-poppins">{diag.value}</h3>
                <span className="text-[10px] text-green-600 font-semibold mt-1 block">{diag.status}</span>
              </div>
              <div className={`p-2.5 rounded-lg ${diag.color}`}>
                <Icon size={18} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Network Traffic Simulation */}
      <Card>
        <h3 className="text-sm font-bold text-on-surface mb-5">Platform Traffic & Load Volume</h3>
        <div className="flex items-end justify-between h-48 pt-6 border-b border-outline-variant px-4">
          <div className="w-8 bg-primary/20 hover:bg-primary rounded-t h-12" title="Monday: 21k reqs"></div>
          <div className="w-8 bg-primary/20 hover:bg-primary rounded-t h-20" title="Tuesday: 35k reqs"></div>
          <div className="w-8 bg-primary/20 hover:bg-primary rounded-t h-32" title="Wednesday: 54k reqs"></div>
          <div className="w-8 bg-primary/20 hover:bg-primary rounded-t h-28" title="Thursday: 48k reqs"></div>
          <div className="w-8 bg-primary hover:bg-primary/95 rounded-t h-40" title="Friday (Active): 72k reqs"></div>
        </div>
        <div className="flex items-center justify-between text-[10px] font-bold text-on-surface-variant pt-3 px-4">
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI (TODAY)</span>
        </div>
      </Card>
    </div>
  );
};

export default SystemAnalyticsTab;
