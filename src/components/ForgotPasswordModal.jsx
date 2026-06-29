import React, { useState } from 'react';
import { FiX, FiMail, FiKey, FiLock } from 'react-icons/fi';

// Self-contained forgot-password flow. Talks to the backend directly:
//   1) POST /auth/forgot-password { email }  -> a 6-digit code is printed in the
//      backend (uvicorn) terminal.
//   2) POST /auth/reset-password { email, code, new_password } -> sets new password.
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

const ForgotPasswordModal = ({ initialEmail = '', onClose }) => {
  const [step, setStep] = useState(1);              // 1 = request code, 2 = reset
  const [email, setEmail] = useState(initialEmail);
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');

  const requestCode = async (e) => {
    e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Could not send a reset code');
      setInfo('A 6-digit code was sent to the server console. Enter it below.');
      setStep(2);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError(''); setInfo(''); setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, new_password: newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.detail || 'Invalid or expired code');
      setInfo('Password updated! You can now log in with your new password.');
      setStep(3);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Reset your password</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><FiX size={20} /></button>
        </div>

        {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
        {info && <p className="mb-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{info}</p>}

        {step === 1 && (
          <form onSubmit={requestCode} className="space-y-4">
            <p className="text-sm text-gray-500">Enter your account email and we'll send a one-time code to the server console.</p>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="name@university.edu"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
              {loading ? 'Sending…' : 'Send reset code'}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={resetPassword} className="space-y-4">
            <p className="text-sm text-gray-500">Enter the 6-digit code from the server console and choose a new password.</p>
            <div className="relative">
              <FiKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text" required value={code} onChange={(e) => setCode(e.target.value)}
                placeholder="6-digit code" maxLength={6}
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm tracking-widest text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New password (min 6 chars)"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-60">
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        )}

        {step === 3 && (
          <button onClick={onClose}
            className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
            Back to login
          </button>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
