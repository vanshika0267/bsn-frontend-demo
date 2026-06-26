import React from 'react';
import { platformSystemLogs } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';

const SystemReportsTab = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Plagiarism & System Integrity Audits</h2>
        <p className="text-xs text-on-surface-variant">Monitor background duplicate scan triggers, ledger consistency checks, and transaction logs.</p>
      </div>

      <Table 
        headers={['Audit ID', 'System Module', 'Resource Target', 'Similarity Ratio', 'Verification Status', 'Timestamp']}
        data={platformSystemLogs}
        renderRow={(log) => (
          <tr key={log.id} className="hover:bg-surface transition-colors">
            <td className="px-6 py-4 font-semibold text-on-surface-variant">{log.id}</td>
            <td className="px-6 py-4 font-bold text-on-surface">{log.event}</td>
            <td className="px-6 py-4 font-semibold">{log.resource}</td>
            <td className="px-6 py-4 font-bold text-error">{log.similarity}</td>
            <td className="px-6 py-4">
              <Badge variant={log.status === 'Passed' || log.status === 'Success' || log.status === 'Approved' ? 'success' : 'error'}>
                {log.status}
              </Badge>
            </td>
            <td className="px-6 py-4 text-on-surface-variant">{log.time}</td>
          </tr>
        )}
      />
    </div>
  );
};

export default SystemReportsTab;
