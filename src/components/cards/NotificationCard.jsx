import React from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';

const NotificationCard = ({
  notification
}) => {
  const { markNotificationAsRead, clearNotification } = useApp();
  const { id, title, description, timestamp, read, icon } = notification;

  return (
    <div 
      onClick={() => !read && markNotificationAsRead(id)}
      className={`group relative p-4 rounded-xl border transition-all duration-200 flex gap-3.5 cursor-pointer select-none ${
        read 
          ? 'bg-white border-outline-variant hover:bg-surface' 
          : 'bg-[#eff6ff]/40 border-primary/20 hover:bg-[#eff6ff]/70'
      }`}
    >
      {/* Read/Unread Accent Dot */}
      {!read && (
        <span className="absolute top-4.5 right-4 w-2 h-2 rounded-full bg-primary shadow-md shadow-primary/20"></span>
      )}

      {/* Icon Wrapper */}
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg select-none shrink-0 ${
        read ? 'bg-surface-container border border-outline-variant' : 'bg-[#eff6ff] border border-primary/30 text-[#1e40af]'
      }`}>
        {icon || '🔔'}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <div className="flex items-baseline justify-between gap-2">
          <h4 className={`text-xs font-bold ${read ? 'text-on-surface-variant' : 'text-on-surface'}`}>
            {title}
          </h4>
        </div>
        <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">{description}</p>
        <span className="text-[10px] text-on-surface-variant/75 font-medium mt-2 block">{timestamp}</span>
      </div>

      {/* Hover Actions */}
      <div className="absolute right-3 bottom-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
        {!read && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              markNotificationAsRead(id);
            }}
            title="Mark as read"
            className="p-1 rounded bg-surface-container text-on-surface-variant hover:text-[#166534] hover:bg-surface-container-high transition-colors"
          >
            <FiCheck size={14} />
          </button>
        )}
        <button
          onClick={(e) => {
            e.stopPropagation();
            clearNotification(id);
          }}
          title="Delete notification"
          className="p-1 rounded bg-surface-container text-on-surface-variant hover:text-error hover:bg-surface-container-high transition-colors"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  );
};

export default NotificationCard;
