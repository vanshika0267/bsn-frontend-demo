import React from 'react';
import { detectRoleFromEmail, ROLE_META } from '../../utils/roleDetection';

export default function RoleBadge({ email }) {
  if (!email || !email.includes('@')) return null;

  const { role, confidence, matchedRule, domain } = detectRoleFromEmail(email);
  if (!role) return null;

  const meta = ROLE_META[role];
  if (!meta) return null;

  const confidenceColors = {
    high: 'bg-green-50 text-green-700 border-green-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-slate-50 text-slate-600 border-slate-200',
  };

  return (
    <div className="p-3.5 rounded-xl border bg-slate-50/50 border-outline-variant flex flex-col gap-1.5 text-left transition-all">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">
          Detected Persona
        </span>
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border capitalize ${confidenceColors[confidence] || confidenceColors.low}`}>
          {confidence} Confidence
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xl">{meta.icon}</span>
        <div>
          <div className="text-sm font-bold text-on-surface flex items-center gap-1.5">
            {meta.label}
          </div>
          <div className="text-[11px] text-on-surface-variant font-light">
            {meta.description}
          </div>
        </div>
      </div>
      <div className="text-[10px] text-on-surface-variant border-t border-outline-variant/60 pt-1.5 mt-0.5 flex flex-wrap gap-x-2">
        <span><b>Domain:</b> {domain}</span>
        <span className="text-outline">•</span>
        <span><b>Rule:</b> {matchedRule}</span>
      </div>
    </div>
  );
}
