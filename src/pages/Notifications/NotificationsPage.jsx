import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheckSquare, FiInbox, FiLoader, FiAlertTriangle } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { getNotifications, markNotificationRead } from '../../services/api';
import DashboardLayout from '../../layouts/DashboardLayout';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

// Turn an ISO timestamp into a short relative label (falls back to a date).
const relativeTime = (iso) => {
  if (!iso) return '';
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';
  const diff = Math.floor((Date.now() - then.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

const NotificationsPage = () => {
  const { user } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', 'Unread'];

  const load = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getNotifications(user.id);
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load notifications.');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleRead = async (notif) => {
    if (notif.read) return;
    try {
      await markNotificationRead(notif.id);
      await load();
    } catch (err) {
      setError(err.message || 'Failed to update notification.');
    }
  };

  const handleMarkAll = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    try {
      await Promise.all(unread.map((n) => markNotificationRead(n.id)));
      await load();
    } catch (err) {
      setError(err.message || 'Failed to update notifications.');
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifs = notifications.filter((notif) => {
    if (activeCategory === 'Unread') return !notif.read;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-poppins text-on-surface flex items-center gap-2">
              <FiBell className="text-primary" /> Notifications Center
            </h1>
            <p className="text-xs text-on-surface-variant">
              You have <strong className="text-primary font-semibold">{unreadCount}</strong> unread invitations or ranking notices.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              onClick={handleMarkAll}
              variant="secondary"
              size="sm"
              className="gap-1.5 self-start sm:self-auto py-2"
            >
              <FiCheckSquare size={14} /> Mark all read
            </Button>
          )}
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar shrink-0 border-b border-outline-variant">
          {categories.map((cat) => {
            const count = cat === 'Unread' ? unreadCount : notifications.length;
            // Calculate specific count per category
            const count = cat === 'All'
              ? notifications.length
              : cat === 'Unread'
              ? unreadCount
              : notifications.filter(n => n.type === cat).length;

            const isActive = activeCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#eff6ff] text-[#1e40af] border border-primary/20'
                    : 'bg-transparent text-on-surface-variant border border-transparent hover:text-on-surface'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                  isActive ? 'bg-[#bfdbfe] text-[#1e40af]' : 'bg-surface-container text-on-surface-variant border border-outline-variant'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notification Cards Feed */}
        <div className="space-y-3 min-h-[300px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center text-center py-16 text-on-surface-variant">
              <FiLoader size={26} className="animate-spin text-primary mb-3" />
              <p className="text-xs font-medium">Loading your notifications...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-error/40 rounded-xl w-full max-w-lg mx-auto my-6">
              <div className="w-14 h-14 rounded-xl bg-[#fef2f2] border border-[#fca5a5] flex items-center justify-center text-error mb-4">
                <FiAlertTriangle size={26} />
              </div>
              <h3 className="text-base font-semibold text-on-surface mb-1">Couldn't load notifications</h3>
              <p className="text-xs text-on-surface-variant max-w-sm mb-5 leading-relaxed">{error}</p>
              <Button onClick={load} variant="secondary" size="sm">Try again</Button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifs.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState
                    icon={FiInbox}
                    title="No notifications in this folder"
                    description="All caught up! Check back later for updates regarding new internships, connections, or ranking shifts."
                  />
                </motion.div>
              ) : (
                filteredNotifs.map((notif) => (
                  <motion.div
                    key={notif.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.18 }}
                    layout
                  >
                    <div
                      onClick={() => handleRead(notif)}
                      className={`group relative p-4 rounded-xl border transition-all duration-200 flex gap-3.5 cursor-pointer select-none ${
                        notif.read
                          ? 'bg-white border-outline-variant hover:bg-surface'
                          : 'bg-[#eff6ff]/40 border-primary/20 hover:bg-[#eff6ff]/70'
                      }`}
                    >
                      {/* Read/Unread Accent Dot */}
                      {!notif.read && (
                        <span className="absolute top-4.5 right-4 w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/20"></span>
                      )}

                      {/* Icon Wrapper */}
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg select-none shrink-0 ${
                        notif.read ? 'bg-surface-container border border-outline-variant' : 'bg-[#eff6ff] border border-primary/30 text-[#1e40af]'
                      }`}>
                        🔔
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 pr-6">
                        <p className={`text-xs leading-relaxed ${notif.read ? 'text-on-surface-variant font-medium' : 'text-on-surface font-bold'}`}>
                          {notif.text}
                        </p>
                        <span className="text-[10px] text-on-surface-variant/75 font-medium mt-2 block">
                          {relativeTime(notif.created_at)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
