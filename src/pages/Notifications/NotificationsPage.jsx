import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBell, FiCheckSquare, FiInbox } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import NotificationCard from '../../components/cards/NotificationCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';

const NotificationsPage = () => {
  const { notifications, markAllNotificationsAsRead } = useApp();
  const [activeCategory, setActiveCategory] = useState('All');

  // Categories: All, Unread, Opportunities, Invitations, Rankings
  const categories = ['All', 'Unread', 'Opportunities', 'Invitations', 'Rankings'];

  const filteredNotifs = notifications.filter((notif) => {
    if (activeCategory === 'All') return true;
    if (activeCategory === 'Unread') return !notif.read;
    return notif.type === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

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
              onClick={markAllNotificationsAsRead}
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
            // Calculate specific count per category
            let count = 0;
            if (cat === 'All') count = notifications.length;
            else if (cat === 'Unread') count = unreadCount;
            else count = notifications.filter(n => n.type === cat).length;

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
                  <NotificationCard notification={notif} />
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
