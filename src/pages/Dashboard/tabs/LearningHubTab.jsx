import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { FiBookOpen, FiAward, FiChevronRight, FiBarChart2 } from 'react-icons/fi';

const LearningHubTab = () => {
  const { courses } = useApp();
  const navigate = useNavigate();

  const calculateProgress = (modules) => {
    if (!modules || modules.length === 0) return 0;
    const completedCount = modules.filter(m => m.completed).length;
    return Math.round((completedCount / modules.length) * 100);
  };

  const handleOpenCourse = (course) => {
    navigate(`/syllabus/edit?courseId=${course.id}`);
  };

  const totalProgress = Math.round(
    courses.reduce((acc, course) => acc + calculateProgress(course.modules), 0) / courses.length
  );

  return (
    <div className="space-y-6 text-left">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Learning Hub</h2>
          <p className="text-xs text-on-surface-variant">Follow structured tracks, master technical topics, and track your syllabus progress.</p>
        </div>

        {/* Global Progress Indicator */}
        <div className="w-full md:w-64 bg-[#eff6ff]/40 border border-primary/20 p-4 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-[9px] text-on-surface-variant font-bold uppercase tracking-wider block">Overall Progress</span>
            <p className="text-lg font-black text-primary leading-tight">{totalProgress}% Done</p>
          </div>
          <div className="h-10 w-10 text-primary bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center">
            <FiBarChart2 size={18} />
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 gap-5">
        {courses.map((course) => {
          const prog = calculateProgress(course.modules);
          const completedModules = course.modules.filter(m => m.completed).length;
          return (
            <Card 
              key={course.id} 
              hoverable={true} 
              onClick={() => handleOpenCourse(course)}
              className="bg-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2 flex-1 text-left">
                <div className="flex items-center gap-2">
                  <Badge variant={course.track === 'Software Engineering' ? 'primary' : course.track === 'Discrete Mathematics' ? 'secondary' : 'success'}>
                    {course.track}
                  </Badge>
                  <span className="text-[10px] text-on-surface-variant font-bold tracking-wider uppercase flex items-center gap-1">
                    <FiBookOpen size={12} />
                    {course.modules.length} Modules
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-on-surface leading-tight font-poppins">{course.title}</h3>
                <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed font-light">{course.description}</p>
              </div>

              {/* Progress and Action */}
              <div className="w-full md:w-64 shrink-0 space-y-4 text-left">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-on-surface-variant">Progress</span>
                    <span className="text-on-surface">{prog}% ({completedModules}/{course.modules.length})</span>
                  </div>
                  <div className="w-full bg-surface-container border border-outline-variant h-2.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${
                        prog === 100 ? 'bg-success' : 'bg-primary'
                      }`}
                      style={{ width: `${prog}%` }}
                    />
                  </div>
                </div>

                <Button variant="outline" className="w-full flex items-center justify-center gap-1" size="sm">
                  <span>Open syllabus tracker</span>
                  <FiChevronRight size={14} />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearningHubTab;
