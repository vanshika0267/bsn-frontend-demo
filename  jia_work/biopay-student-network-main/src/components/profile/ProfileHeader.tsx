import { useApp } from '../../context/AppContext';
import { useRef, useState } from 'react';

export default function ProfileHeader() {
  const { user } = useApp();
  const fileRef = useRef<HTMLInputElement>(null);
  const [avatar, setAvatar] = useState(user?.avatar);

  const onPick = () => fileRef.current?.click();
  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    setAvatar(url);
  };

  return (
    <div className="bg-white rounded-[24px] border border-[--color-border-gray] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row items-start gap-6">
        <div className="relative group">
          <img
            src={avatar}
            alt={user?.name}
            className="w-28 h-28 rounded-[20px] object-cover bg-slate-100 ring-1 ring-slate-200"
          />
          <button
            onClick={onPick}
            className="absolute -bottom-2 -right-2 text-[11px] px-3 py-1.5 rounded-full bg-[--color-secondary-navy] text-white shadow-lg opacity-0 group-hover:opacity-100 transition"
          >
            Change
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFile} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-display text-[24px] text-[--color-secondary-navy] leading-tight">{user?.name}</h2>
              <p className="text-slate-500 text-[14px] mt-0.5">{user?.email}</p>
            </div>
            <button
              onClick={onPick}
              className="text-[13px] px-4 py-2 rounded-xl border border-[--color-border-gray] hover:bg-slate-50"
            >
              Update photo
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4 text-[12px]">
            <span className="px-3 py-1.5 rounded-full bg-[#EFF6FF] text-[#1D4ED8]">Verified</span>
            <span className="px-3 py-1.5 rounded-full bg-[#ECFDF5] text-[#059669]">Active</span>
            <span className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700">Patna, IN</span>
          </div>
        </div>
      </div>
    </div>
  );
}
