import React, { useState } from 'react';
import { platformUsers } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import { FiUserCheck, FiUserMinus } from 'react-icons/fi';

const UserManagementTab = () => {
  const [users, setUsers] = useState(platformUsers);

  const toggleStatus = (id) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } 
        : u
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Global User Account Directory</h2>
        <p className="text-xs text-on-surface-variant">Configure login permissions, check account validation status, or suspend/restore profiles.</p>
      </div>

      <Table 
        headers={['Account ID', 'User Name', 'Assigned Persona', 'Registered College', 'Status', 'Actions']}
        data={users}
        renderRow={(usr) => (
          <tr key={usr.id} className="hover:bg-surface transition-colors">
            <td className="px-6 py-4 font-semibold text-on-surface-variant">{usr.id}</td>
            <td className="px-6 py-4 font-bold text-on-surface">{usr.name}</td>
            <td className="px-6 py-4 font-semibold text-primary">{usr.role}</td>
            <td className="px-6 py-4 text-on-surface-variant">{usr.college}</td>
            <td className="px-6 py-4">
              <Badge variant={usr.status === 'Active' ? 'success' : 'error'}>
                {usr.status}
              </Badge>
            </td>
            <td className="px-6 py-4">
              <button 
                onClick={() => toggleStatus(usr.id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors ${
                  usr.status === 'Active' 
                    ? 'bg-error/15 text-error hover:bg-error/20' 
                    : 'bg-success/15 text-success hover:bg-success/20'
                }`}
              >
                {usr.status === 'Active' ? (
                  <>
                    <FiUserMinus size={13} /> Suspend
                  </>
                ) : (
                  <>
                    <FiUserCheck size={13} /> Activate
                  </>
                )}
              </button>
            </td>
          </tr>
        )}
      />
    </div>
  );
};

export default UserManagementTab;
