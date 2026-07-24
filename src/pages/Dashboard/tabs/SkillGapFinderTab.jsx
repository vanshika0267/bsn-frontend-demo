import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { useApp } from '../../../context/AppContext';
import { skillGap } from '../../../services/api';
import { FiShield, FiArrowRight, FiZap, FiTarget, FiLoader, FiAlertTriangle, FiSearch } from 'react-icons/fi';

const SkillGapFinderTab = () => {
  const { user } = useApp();
  const [targetRole, setTargetRole] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const runAnalysis = async (e) => {
    if (e) e.preventDefault();
    const role = targetRole.trim();
    if (!role || !user?.id) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await skillGap(user.id, role);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to run the skill gap analysis.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
    setTargetRole('');
  };

  const have = Array.isArray(result?.have) ? result.have : [];
  const missing = Array.isArray(result?.missing) ? result.missing : [];
  const score = Math.max(0, Math.min(100, Math.round(result?.readiness_score ?? 0)));

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h2 className="text-2xl font-bold font-poppins text-on-surface">Skill Gap Finder</h2>
        <p className="text-xs text-on-surface-variant">Enter a target role to scan your competencies against it and reveal the skills you have and the ones you still need.</p>
      </div>

      {/* Target role input */}
      <Card hoverable={false} className="p-6 max-w-2xl mx-auto space-y-4 bg-white border border-outline-variant shadow-sm text-left">
        <div className="space-y-2.5">
          <Badge variant="primary">Target Role</Badge>
          <h3 className="text-lg font-extrabold text-on-surface font-poppins">Which role are you aiming for?</h3>
        </div>
        <form onSubmit={runAnalysis} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Frontend Developer, Data Engineer..."
            className="flex-1 px-4 py-3 bg-white border border-outline-variant rounded-xl text-xs font-bold text-on-surface placeholder:text-on-surface-variant/60 placeholder:font-medium focus:outline-none focus:border-primary transition-colors"
          />
          <Button type="submit" variant="primary" size="sm" disabled={loading || !targetRole.trim()} className="gap-1.5 shrink-0 py-3">
            {loading ? <FiLoader size={14} className="animate-spin" /> : <FiSearch size={14} />}
            {loading ? 'Analyzing...' : 'Find Gaps'}
          </Button>
        </form>
      </Card>

      {/* Error state */}
      {error && (
        <Card hoverable={false} className="p-6 max-w-2xl mx-auto bg-white border border-error/40 shadow-sm text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-xl bg-[#fef2f2] border border-[#fca5a5] flex items-center justify-center text-error">
            <FiAlertTriangle size={22} />
          </div>
          <p className="text-xs font-bold text-on-surface">Something went wrong</p>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">{error}</p>
          <Button onClick={runAnalysis} variant="secondary" size="sm">Try again</Button>
        </Card>
      )}

      {/* Loading state */}
      {loading && !result && !error && (
        <div className="flex flex-col items-center justify-center text-center py-12 text-on-surface-variant">
          <FiLoader size={26} className="animate-spin text-primary mb-3" />
          <p className="text-xs font-medium">Scanning your skills against the target role...</p>
        </div>
      )}

      {/* Results */}
      {result && !loading && !error && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Readiness + skills */}
          <Card hoverable={false} className="lg:col-span-2 border border-outline-variant bg-white p-6 space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-extrabold text-on-surface font-poppins flex items-center gap-2">
                <FiTarget className="text-primary" size={18} /> Readiness for {result.target_role || targetRole}
              </h3>
              <Button variant="outline" size="sm" onClick={reset}>
                New Search
              </Button>
            </div>

            {/* Readiness score + progress bar */}
            <div className="space-y-2 py-2">
              <div className="flex justify-between items-end">
                <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">Readiness Score</span>
                <span className="text-2xl font-extrabold font-poppins text-primary">{score}%</span>
              </div>
              <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden border border-outline-variant">
                <div
                  className={`h-full transition-all duration-500 ${score >= 70 ? 'bg-success' : score >= 40 ? 'bg-primary' : 'bg-amber-500'}`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>

            {/* Have skills */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold text-on-surface flex items-center gap-1.5">
                <FiShield className="text-success" size={14} /> Skills You Have
                <span className="text-[10px] text-on-surface-variant font-bold">({have.length})</span>
              </h4>
              {have.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {have.map((skill) => (
                    <Badge key={skill} variant="success">{skill}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-on-surface-variant">No matching skills detected yet for this role.</p>
              )}
            </div>

            {/* Missing skills */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-extrabold text-on-surface flex items-center gap-1.5">
                <FiZap className="text-amber-500" size={14} /> Skills To Learn
                <span className="text-[10px] text-on-surface-variant font-bold">({missing.length})</span>
              </h4>
              {missing.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missing.map((skill) => (
                    <Badge key={skill} variant="default">{skill}</Badge>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-on-surface-variant">No gaps found. You match every skill for this role!</p>
              )}
            </div>
          </Card>

          {/* Summary aside */}
          <div className="space-y-5 text-left">
            <Card hoverable={false} className="border border-outline-variant bg-white p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-on-surface font-poppins flex items-center gap-1.5">
                <FiTarget className="text-primary" size={16} /> Summary
              </h3>

              {missing.length === 0 ? (
                <div className="text-center py-6">
                  <FiShield className="h-10 w-10 text-success mx-auto mb-2" />
                  <p className="text-xs font-bold text-on-surface">You're ready!</p>
                  <p className="text-[10px] text-on-surface-variant mt-1">Your current skills match every requirement for {result.target_role || targetRole}.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-surface border border-outline-variant rounded-xl space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">Skill Gap</span>
                      <Badge variant="error">{missing.length} to learn</Badge>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      You already have {have.length} of the {have.length + missing.length} skills for this role. Focus on the missing ones to raise your readiness above {score}%.
                    </p>
                    <div className="pt-1.5 border-t border-outline-variant flex justify-between items-center">
                      <span className="text-[9px] text-on-surface-variant uppercase tracking-wide font-bold">Next up:</span>
                      <span className="text-[10px] text-primary font-bold flex items-center gap-0.5">
                        {missing[0]} <FiArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapFinderTab;
