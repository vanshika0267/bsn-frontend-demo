import React from 'react';
import { collegeStudents } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import { FiTrendingUp, FiUserCheck, FiUsers } from 'react-icons/fi';

const StudentAnalyticsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Campus Student Analytics</h2>
        <p className="text-xs text-on-surface-variant">Review verification scores, user activity ratios, and placement states across departments.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Active Students</span>
            <h3 className="text-2xl font-black text-on-surface font-poppins">1,842</h3>
            <span className="text-[10px] text-green-600 font-semibold mt-1 block">+12% from last term</span>
          </div>
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
            <FiUsers size={18} />
          </div>
        </Card>
        <Card className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Average Impact Score</span>
            <h3 className="text-2xl font-black text-on-surface font-poppins">640</h3>
            <span className="text-[10px] text-primary font-semibold mt-1 block">Top 15% nationally</span>
          </div>
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
            <FiTrendingUp size={18} />
          </div>
        </Card>
        <Card className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1">Placement Rate</span>
            <h3 className="text-2xl font-black text-on-surface font-poppins">84.2%</h3>
            <span className="text-[10px] text-primary font-semibold mt-1 block">Stripe, AWS, Vercel hires</span>
          </div>
          <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
            <FiUserCheck size={18} />
          </div>
        </Card>
      </div>

      <Card>
        <h3 className="text-sm font-bold text-on-surface mb-4">Student Community Directory</h3>
        <Table 
          headers={['Student Name', 'Branch / Department', 'Year', 'Impact Score', 'Status', 'Employment Status']}
          data={collegeStudents}
          renderRow={(stud) => (
            <tr key={stud.id} className="hover:bg-surface transition-colors">
              <td className="px-6 py-4 font-bold text-on-surface">{stud.name}</td>
              <td className="px-6 py-4 text-on-surface-variant">{stud.branch}</td>
              <td className="px-6 py-4 font-semibold">{stud.year}</td>
              <td className="px-6 py-4 font-bold text-primary">{stud.impactScore}</td>
              <td className="px-6 py-4">
                <Badge variant="primary">{stud.status}</Badge>
              </td>
              <td className="px-6 py-4">
                <span className={`text-xs font-semibold ${stud.placementStatus.includes('Placed') ? 'text-success' : 'text-on-surface-variant'}`}>
                  {stud.placementStatus}
                </span>
              </td>
            </tr>
          )}
        />
      </Card>
    </div>
  );
};

export default StudentAnalyticsTab;
