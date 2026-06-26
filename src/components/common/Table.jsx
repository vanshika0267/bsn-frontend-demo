import React from 'react';

const Table = ({ 
  headers = [], 
  data = [], 
  renderRow, 
  className = '',
  emptyMessage = 'No records found' 
}) => {
  return (
    <div className={`w-full overflow-x-auto rounded-xl border border-outline-variant bg-white shadow-sm ${className}`}>
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-outline-variant bg-surface-container text-on-surface-variant font-bold uppercase tracking-wider">
            {headers.map((header, idx) => (
              <th 
                key={idx} 
                className="px-6 py-4 font-bold uppercase tracking-wider font-poppins"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant font-medium text-on-surface">
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td 
                colSpan={headers.length} 
                className="px-6 py-8 text-center text-sm text-on-surface-variant font-medium"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
