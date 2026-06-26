import React from 'react';
import { FiInbox } from 'react-icons/fi';
import Button from './Button';

const EmptyState = ({
  icon: Icon = FiInbox,
  title = "No data found",
  description = "There is nothing to display here at the moment.",
  actionText,
  onActionClick
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white border border-dashed border-outline-variant rounded-xl w-full max-w-lg mx-auto my-6">
      <div className="w-14 h-14 rounded-xl bg-surface-container border border-outline-variant flex items-center justify-center text-on-surface-variant mb-4">
        <Icon size={28} />
      </div>
      <h3 className="text-base font-h3 font-semibold text-on-surface mb-1">{title}</h3>
      <p className="text-xs text-on-surface-variant max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && onActionClick && (
        <Button onClick={onActionClick} variant="secondary" size="sm">
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
