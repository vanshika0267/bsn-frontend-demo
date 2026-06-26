import React, { useState } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Table from '../../../components/common/Table';
import { FiUsers, FiBookOpen, FiActivity, FiLayers, FiCheck, FiX, FiTrendingUp } from 'react-icons/fi';

const AdminDashboardTab = () => {
  const { 
    opportunitiesList, 
    setOpportunitiesList, 
    resourcesList, 
    teamsList, 
    bookedSessionsCount 
  } = useApp();

  // Moderation state: filter opportunities that are NOT 'Vetted' yet
  const moderationQueue = opportunitiesList.filter(opp => opp.status !== 'Vetted' && opp.status !== 'Vetted/Approved' && opp.status !== 'Applied');

  // Handle Approve Vetting
  const handleApprove = (id) => {
    setOpportunitiesList(prev => 
      prev.map(opp => opp.id === id ? { ...opp, status: 'Vetted' } : opp)
    );
  };

  // Handle Reject Vetting
  const handleReject = (id) => {
    setOpportunitiesList(prev => 
      prev.filter(opp => opp.id !== id)
    );
  };

  // Render Table Row
  const renderRow = (opp, index) => {
    return (
      <tr key={opp.id} className="hover:bg-surface border-b border-outline-variant transition-colors">
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold select-none">{opp.logo || '💼'}</span>
            <div>
              <p className="text-xs font-bold text-on-surface">{opp.title}</p>
              <p className="text-[10px] text-on-surface-variant font-semibold">{opp.company || opp.host}</p>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <Badge variant="primary">{opp.track || 'Software Engineering'}</Badge>
        </td>
        <td className="px-6 py-4 text-xs font-semibold text-on-surface-variant">
          {opp.type}
        </td>
        <td className="px-6 py-4 text-xs font-bold text-primary font-poppins">
          {opp.salary || opp.reward}
        </td>
        <td className="px-6 py-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => handleApprove(opp.id)}
              className="p-1.5 rounded-lg bg-green-50 text-success border border-green-200 hover:bg-success hover:text-white transition-all"
              title="Vet & Approve"
            >
              <FiCheck size={14} />
            </button>
            <button
              onClick={() => handleReject(opp.id)}
              className="p-1.5 rounded-lg bg-red-50 text-error border border-red-200 hover:bg-error hover:text-white transition-all"
              title="Reject Opportunity"
            >
              <FiX size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  // Statistics KPI Card Config
  const stats = [
    {
      title: 'Total Network Students',
      value: '48 Active',
      desc: '+12 this week',
      icon: <FiUsers className="text-primary" size={20} />,
      bgColor: 'bg-primary/5'
    },
    {
      title: 'Shared Resources',
      value: `${resourcesList.length} Uploads`,
      desc: 'Sourced by interns',
      icon: <FiBookOpen className="text-secondary" size={20} />,
      bgColor: 'bg-secondary/5'
    },
    {
      title: 'Active Project Squads',
      value: `${teamsList.length} Squads`,
      desc: 'Hackathons & side-builds',
      icon: <FiLayers className="text-success" size={20} />,
      bgColor: 'bg-success/5'
    },
    {
      title: 'Mentor Sessions Booked',
      value: `${bookedSessionsCount} Calls`,
      desc: '1-on-1 alumni reviews',
      icon: <FiActivity className="text-amber-500" size={20} />,
      bgColor: 'bg-amber-500/5'
    }
  ];

  return (
    <div className="space-y-6 text-left">
      {/* Intro */}
      <div>
        <h1 className="text-2xl font-bold font-poppins text-on-surface">Administrative Control Hub</h1>
        <p className="text-xs text-on-surface-variant">Review network metrics, vet corporate opportunities, and manage student learning progress.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => (
          <Card key={idx} hoverable={true} className="bg-white border border-outline-variant p-5 text-left">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider block">{stat.title}</span>
                <p className="text-xl font-black text-on-surface leading-none">{stat.value}</p>
                <span className="text-[10px] text-on-surface-variant/80 font-semibold block">{stat.desc}</span>
              </div>
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center border border-outline-variant/30 ${stat.bgColor}`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Moderation section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-on-surface font-poppins"> Vetting & Moderation Queue</h2>
          <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-error border border-error/20 text-xs font-bold">
            {moderationQueue.length} Pending
          </span>
        </div>

        <Table
          headers={['Job/Opportunity Details', 'Track Alignment', 'Type', 'Stipend/Reward', 'Actions']}
          data={moderationQueue}
          renderRow={renderRow}
          emptyMessage="No pending corporate opportunities require vetting at this time."
        />
      </div>

      {/* System Activity Chart Mock */}
      <Card className="bg-white border border-outline-variant p-6 space-y-4 text-left shadow-sm">
        <div className="flex justify-between items-center border-b border-outline-variant pb-3">
          <h3 className="text-sm font-extrabold text-on-surface font-poppins flex items-center gap-1.5">
            <FiTrendingUp className="text-primary" size={16} /> Student Vetting Engagement Trends (Last 7 Days)
          </h3>
          <span className="text-[10px] text-on-surface-variant font-bold uppercase">Updated 5m ago</span>
        </div>

        <div className="h-44 flex items-end justify-between pt-6 px-4">
          {[35, 45, 60, 40, 75, 90, 85].map((val, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              <div className="w-full max-w-[20px] bg-primary-container rounded-t-md relative group transition-all duration-300 hover:bg-primary" style={{ height: `${val * 1.2}px` }}>
                <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-on-surface text-white text-[9px] font-bold px-1 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}%
                </span>
              </div>
              <span className="text-[9px] text-on-surface-variant font-bold">Day {idx + 1}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboardTab;
