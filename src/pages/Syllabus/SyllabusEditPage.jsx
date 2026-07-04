import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import DashboardLayout from '../../layouts/DashboardLayout';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { FiCheckSquare, FiSquare, FiAward, FiBookOpen } from 'react-icons/fi';

const SyllabusEditPage = () => {
  const { courses, setCourses } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  // Determine active course from query parameter or default to the first course
  const queryParams = new URLSearchParams(location.search);
  const courseIdParam = Number(queryParams.get('courseId'));
  
  // Clone the global courses state to allow transactional saves/cancels
  const [tempCourses, setTempCourses] = useState(() => JSON.parse(JSON.stringify(courses)));
  
  const initialActiveId = tempCourses.some(c => c.id === courseIdParam) 
    ? courseIdParam 
    : (tempCourses[0]?.id || 1);
  const [activeCourseId, setActiveCourseId] = useState(initialActiveId);

  const activeCourse = tempCourses.find(c => c.id === activeCourseId);

  const toggleModule = (moduleId) => {
    setTempCourses(prev =>
      prev.map(c => {
        if (c.id === activeCourseId) {
          return {
            ...c,
            modules: c.modules.map(m =>
              m.id === moduleId ? { ...m, completed: !m.completed } : m
            )
          };
        }
        return c;
      })
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    setCourses(tempCourses);
    navigate('/dashboard?tab=learning-hub');
  };

  const handleCancel = () => {
    navigate('/dashboard?tab=learning-hub');
  };

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6 text-left">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Edit Syllabus Tracker</h2>
          <p className="text-xs text-on-surface-variant">Update your course progress. Check off modules you have completed.</p>
        </div>

        {/* Course Selection Tabs */}
        <div className="flex border-b border-outline-variant gap-2 overflow-x-auto no-scrollbar">
          {tempCourses.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCourseId(c.id)}
              className={`px-4 py-2.5 font-poppins text-xs font-bold border-b-2 transition-all whitespace-nowrap cursor-pointer ${
                activeCourseId === c.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {c.title}
            </button>
          ))}
        </div>

        {activeCourse ? (
          <Card className="bg-white p-6 border border-outline-variant shadow-sm space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-[#eff6ff] text-[#1e40af] border border-primary/20">
                  {activeCourse.track}
                </span>
                <span className="text-[10px] text-on-surface-variant font-bold tracking-wider uppercase flex items-center gap-1">
                  <FiBookOpen size={12} />
                  {activeCourse.modules.length} Modules
                </span>
              </div>
              <h3 className="text-lg font-extrabold text-on-surface font-poppins">{activeCourse.title}</h3>
              <p className="text-xs text-on-surface-variant font-light leading-relaxed">{activeCourse.description}</p>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Check off the modules you have completed. Your progress bars will instantly update upon saving.
              </p>

              <div className="space-y-2 border-t border-outline-variant pt-4">
                {activeCourse.modules.map((mod) => (
                  <button
                    key={mod.id}
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    className="w-full flex items-start gap-3 p-3.5 bg-white border border-outline-variant hover:border-primary rounded-xl transition-all duration-150 text-left group cursor-pointer"
                  >
                    <div className="shrink-0 mt-0.5 text-primary group-hover:scale-105 transition-transform">
                      {mod.completed ? (
                        <FiCheckSquare size={18} className="text-success" />
                      ) : (
                        <FiSquare size={18} className="text-on-surface-variant" />
                      )}
                    </div>
                    <div>
                      <p className={`text-xs font-bold ${mod.completed ? 'text-on-surface-variant/70 line-through' : 'text-on-surface'}`}>
                        {mod.name}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-t border-outline-variant pt-4 mt-6">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1.5">
                <FiAward className="h-4 w-4 text-primary" />
                Completion XP: {activeCourse.xpReward} XP
              </span>
              <div className="flex gap-3 justify-end w-full sm:w-auto">
                <Button type="button" onClick={handleCancel} variant="outline" size="sm" className="w-full sm:w-auto">
                  Cancel
                </Button>
                <Button type="button" onClick={handleSave} variant="primary" size="sm" className="w-full sm:w-auto">
                  Save Tracker
                </Button>
              </div>
            </div>
          </Card>
        ) : (
          <Card className="p-8 text-center border-dashed">
            <p className="text-xs text-on-surface-variant italic">No course selected.</p>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SyllabusEditPage;
