import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import Table from '../../../components/common/Table';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import {
  adminListUsers, adminChangeRole, adminVerifyUser, adminDeleteUser
} from '../../../services/api';
import {
  FiUserCheck, FiUserX, FiTrash2, FiAlertCircle, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const ROLE_OPTIONS = [
  { value: '', label: 'All Roles' },
  { value: 'student', label: 'Student' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'admin', label: 'Admin' },
];

const CHANGE_ROLE_OPTIONS = [
  { value: 'student', label: 'Student' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'faculty', label: 'Faculty' },
  { value: 'admin', label: 'Admin' },
];

const PAGE_SIZE = 20;

const UserManagementTab = () => {
  const { user } = useApp();
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(() => {
    let active = true;
    setLoading(true);
    setError(null);
    adminListUsers({
      q: q || undefined,
      role: roleFilter || undefined,
      page,
      page_size: PAGE_SIZE,
    })
      .then((data) => {
        if (!active) return;
        setUsers(Array.isArray(data && data.results) ? data.results : []);
        setTotalPages((data && data.total_pages) || 1);
        setTotal((data && data.total) || 0);
      })
      .catch((err) => {
        if (active) setError(err.message || 'Failed to load users.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [q, roleFilter, page]);

  useEffect(() => {
    return load();
  }, [load]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [q, roleFilter]);

  const runAction = async (id, fn) => {
    setBusyId(id);
    setError(null);
    try {
      await fn();
      load();
    } catch (err) {
      setError(err.message || 'Action failed.');
    } finally {
      setBusyId(null);
    }
  };

  const handleChangeRole = (usr, newRole) => {
    if (newRole === usr.role) return;
    runAction(usr.id, () => adminChangeRole(usr.id, newRole));
  };

  const handleVerify = (usr) =>
    runAction(usr.id, () => adminVerifyUser(usr.id, !usr.is_verified));

  const handleDelete = (usr) => {
    if (!window.confirm(`Delete user "${usr.name}"? This cannot be undone.`)) return;
    runAction(usr.id, () => adminDeleteUser(usr.id));
  };

  const renderRow = (usr) => {
    const disabled = busyId === usr.id;
    return (
      <tr key={usr.id} className="hover:bg-surface transition-colors">
        <td className="px-6 py-4 font-bold text-on-surface">
          {usr.name}
          <span className="block text-[10px] font-medium text-on-surface-variant">{usr.email}</span>
        </td>
        <td className="px-6 py-4">
          <select
            value={usr.role || 'student'}
            disabled={disabled}
            onChange={(e) => handleChangeRole(usr, e.target.value)}
            className="text-xs rounded-lg py-1.5 px-2 bsn-input border border-outline-variant cursor-pointer disabled:opacity-50"
          >
            {CHANGE_ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </td>
        <td className="px-6 py-4 text-on-surface-variant">{usr.college || '—'}</td>
        <td className="px-6 py-4">
          <Badge variant={usr.is_verified ? 'success' : 'warning'}>
            {usr.is_verified ? 'Verified' : 'Unverified'}
          </Badge>
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVerify(usr)}
              disabled={disabled}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-colors disabled:opacity-50 ${
                usr.is_verified
                  ? 'bg-amber-500/15 text-amber-600 hover:bg-amber-500/20'
                  : 'bg-success/15 text-success hover:bg-success/20'
              }`}
              title={usr.is_verified ? 'Revoke verification' : 'Verify user'}
            >
              {usr.is_verified ? <FiUserX size={13} /> : <FiUserCheck size={13} />}
              {usr.is_verified ? 'Unverify' : 'Verify'}
            </button>
            <button
              onClick={() => handleDelete(usr)}
              disabled={disabled}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold bg-error/15 text-error hover:bg-error/20 transition-colors disabled:opacity-50"
              title="Delete user"
            >
              <FiTrash2 size={13} /> Delete
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Global User Account Directory</h2>
        <p className="text-xs text-on-surface-variant">Configure login permissions, check account validation status, or manage profiles.</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-outline-variant p-4 rounded-xl flex flex-col sm:flex-row sm:items-center gap-4 shadow-sm">
        <SearchBar
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name or email..."
          className="sm:max-w-xs"
        />
        <div className="sm:max-w-[180px] w-full">
          <Select
            options={ROLE_OPTIONS}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b] text-sm font-semibold">
          <FiAlertCircle size={16} /> {error}
        </div>
      )}

      {/* Table / loading */}
      {loading ? (
        <div className="w-full rounded-xl border border-outline-variant bg-white shadow-sm p-10 text-center text-sm text-on-surface-variant font-medium animate-pulse">
          Loading users…
        </div>
      ) : (
        <Table
          headers={['User', 'Role', 'College', 'Status', 'Actions']}
          data={users}
          renderRow={renderRow}
          emptyMessage={error ? 'Could not load users.' : 'No users match your filters.'}
        />
      )}

      {/* Pagination */}
      {!loading && users.length > 0 && (
        <div className="flex items-center justify-between">
          <span className="text-xs text-on-surface-variant font-semibold">
            Page {page} of {totalPages} · {total} users
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <FiChevronLeft size={14} /> Prev
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next <FiChevronRight size={14} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementTab;
