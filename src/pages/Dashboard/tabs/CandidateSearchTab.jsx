import React, { useState } from 'react';
import { recruiterCandidates } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Table from '../../../components/common/Table';
import { FiSearch, FiAward, FiBookOpen } from 'react-icons/fi';

const CandidateSearchTab = () => {
  const [query, setQuery] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const skillsList = ['React.js', 'Python', 'Node.js', 'C++', 'PyTorch', 'Figma'];

  const filteredCandidates = recruiterCandidates.filter(c => {
    const matchesQuery = c.name.toLowerCase().includes(query.toLowerCase()) || 
                         c.college.toLowerCase().includes(query.toLowerCase());
    const matchesSkill = !selectedSkill || c.skills.includes(selectedSkill);
    return matchesQuery && matchesSkill;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Verified Talent Discovery</h2>
          <p className="text-xs text-on-surface-variant">Filter college candidates by real, audited project scores and skill verification records.</p>
        </div>
      </div>

      {/* Filters Bar */}
      <Card className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 w-full">
          <SearchBar 
            placeholder="Search candidates by name or institution..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="w-full md:w-48">
          <select 
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full bg-white border border-outline-variant rounded-lg text-xs font-semibold text-on-surface px-3 py-2.5 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="">All Skills</option>
            {skillsList.map(skill => (
              <option key={skill} value={skill}>{skill}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Candidates List / Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCandidates.map(cand => (
          <Card key={cand.id} hoverable className="flex flex-col gap-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-container text-white flex items-center justify-center text-xl shrink-0 font-bold">
                {cand.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-on-surface text-sm">{cand.name}</h3>
                  <div className="flex items-center gap-1">
                    <FiAward className="text-amber-500 fill-current" size={14} />
                    <span className="text-xs font-bold text-on-surface">{cand.impactScore}</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant font-semibold mt-0.5">{cand.college}</p>
                <p className="text-[10px] text-primary font-bold uppercase tracking-wide mt-1">{cand.branch}</p>
              </div>
            </div>

            <div className="border-t border-outline-variant pt-3">
              <span className="text-[10px] uppercase font-bold text-on-surface-variant block mb-1.5">Verified Badges</span>
              <div className="flex flex-wrap gap-1.5">
                {cand.skills.map((skill, idx) => (
                  <Badge key={idx} variant="primary">{skill}</Badge>
                ))}
              </div>
            </div>
            
            <button className="w-full py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors mt-2">
              View Verified Portfolio
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CandidateSearchTab;
