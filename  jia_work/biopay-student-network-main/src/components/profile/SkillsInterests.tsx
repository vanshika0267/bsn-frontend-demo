import { useState } from 'react';

export default function SkillsInterests() {
  const [skills, setSkills] = useState(['React', 'TypeScript', 'Node.js', 'Tailwind']);
  const [interests, setInterests] = useState(['Machine Learning', 'Open Source', 'UI/UX']);
  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');

  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) { setSkills([...skills, s]); setSkillInput(''); }
  };
  const removeSkill = (s: string) => setSkills(skills.filter(x => x !== s));
  const addInterest = () => {
    const s = interestInput.trim();
    if (s && !interests.includes(s)) { setInterests([...interests, s]); setInterestInput(''); }
  };
  const removeInterest = (s: string) => setInterests(interests.filter(x => x !== s));

  return (
    <div className="bg-white rounded-[24px] border border-[--color-border-gray] p-6 shadow-sm">
      <h3 className="font-display text-[18px] font-semibold text-[--color-secondary-navy] mb-5">Skills & Interests</h3>
      
      <div className="space-y-6">
        <div>
          <div className="text-[13px] font-medium text-slate-700 mb-3">Skills</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map(s => (
              <span key={s} className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-full bg-slate-100 text-slate-800 border border-[--color-border-gray]">
                {s}
                <button onClick={()=>removeSkill(s)} className="opacity-60 group-hover:opacity-100 hover:text-red-600">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-md">
            <input
              value={skillInput}
              onChange={e=>setSkillInput(e.target.value)}
              onKeyDown={e=> e.key==='Enter' && (e.preventDefault(), addSkill())}
              placeholder="Add a skill…"
              className="flex-1 px-3.5 py-2 rounded-xl border border-[--color-border-gray] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/15"
            />
            <button onClick={addSkill} className="px-4 py-2 rounded-xl bg-[--color-secondary-navy] text-white text-[13px]">Add</button>
          </div>
        </div>

        <div className="pt-5 border-t border-[--color-border-gray]">
          <div className="text-[13px] font-medium text-slate-700 mb-3">Interests</div>
          <div className="flex flex-wrap gap-2 mb-3">
            {interests.map(s => (
              <span key={s} className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] rounded-full bg-[#ECFDF5] text-[#047857] border border-emerald-100">
                {s}
                <button onClick={()=>removeInterest(s)} className="opacity-60 group-hover:opacity-100 hover:text-red-600">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 max-w-md">
            <input
              value={interestInput}
              onChange={e=>setInterestInput(e.target.value)}
              onKeyDown={e=> e.key==='Enter' && (e.preventDefault(), addInterest())}
              placeholder="Add an interest…"
              className="flex-1 px-3.5 py-2 rounded-xl border border-[--color-border-gray] text-[13px] focus:outline-none focus:ring-2 focus:ring-[#2563eb]/15"
            />
            <button onClick={addInterest} className="px-4 py-2 rounded-xl bg-[--color-primary-blue] text-white text-[13px]">Add</button>
          </div>
        </div>
      </div>
    </div>
  );
}
