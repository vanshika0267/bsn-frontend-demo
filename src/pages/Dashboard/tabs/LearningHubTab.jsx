import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import Modal from '../../../components/common/Modal';
import { FiBookOpen, FiAward, FiCheckSquare, FiSquare, FiChevronRight, FiBarChart2 } from 'react-icons/fi';

const LearningHubTab = () => {
  const [courses, setCourses] = useState([
    {
      id: 1,
      title: 'Software Engineering Mastery',
      track: 'Software Engineering',
      description: 'Master React, Tailwind CSS, Advanced Hooks, Redux Toolkit, and performance optimizations.',
      modules: [
        { id: 'fe-1', name: 'HTML5 Semantic Structure & SEO Best Practices', completed: true },
        { id: 'fe-2', name: 'CSS Flexbox, Grid, & Advanced Tailwind Patterns', completed: true },
        { id: 'fe-3', name: 'React Fundamentals & Component Lifecycle', completed: true },
        { id: 'fe-4', name: 'Hooks Deep Dive: useEffect, custom hooks, and memoization', completed: false },
        { id: 'fe-5', name: 'State Management: Context API & Redux Toolkit', completed: false },
        { id: 'fe-6', name: 'Vite Compilation, Bundlers, & Production Deployments', completed: false },
      ],
      xpReward: 300,
    },
    {
      id: 2,
      title: 'Discrete Mathematics Foundation',
      track: 'Discrete Mathematics',
      description: 'Learn MVC, RESTful APIs, Node.js, Express, Postgres Database, and JWT authentications.',
      modules: [
        { id: 'be-1', name: 'Node.js Event Loop & Non-blocking I/O', completed: false },
        { id: 'be-2', name: 'Express Server setup and Routing controllers', completed: false },
        { id: 'be-3', name: 'Database schema design & migrations (Postgres)', completed: false },
        { id: 'be-4', name: 'Authentication flow: JWT tokens and sessions', completed: false },
      ],
      xpReward: 400,
    },
    {
      id: 3,
      title: 'Java Development Essentials',
      track: 'Java',
      description: 'Understand Figma layouts, design systems, harmony of typography, and contrast rules.',
      modules: [
        { id: 'ui-1', name: 'Figma Auto layouts & component variant sets', completed: true },
        { id: 'ui-2', name: 'Color harmonies (HSL) and dark-mode guidelines', completed: false },
        { id: 'ui-3', name: 'Typography scales and layouts guidelines', completed: false },
      ],
      xpReward: 250,
    }
  ]);

  const [activeCourse, setActiveCourse] = useState(null);
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);

  const calculateProgress = (modules) => {
    if (!modules || modules.length === 0) return 0;
    const completedCount = modules.filter(m => m.completed).length;
    return Math.round((completedCount / modules.length) * 100);
  };

  const handleOpenCourse = (course) => {
    setActiveCourse(course);
    setIsModuleModalOpen(true);
  };

  const toggleModule = (moduleId) => {
    setCourses(prev =>
      prev.map(c => {
        if (c.id === activeCourse.id) {
          const updatedModules = c.modules.map(m =>
            m.id === moduleId ? { ...m, completed: !m.completed } : m
          );
          // Sync state for local activeCourse modal display
          setActiveCourse({ ...c, modules: updatedModules });
          return { ...c, modules: updatedModules };
        }
        return c;
      })
    );
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

      {/* Module Checklist Modal */}
      {activeCourse && (
        <Modal
          isOpen={isModuleModalOpen}
          onClose={() => setIsModuleModalOpen(false)}
          title={`Syllabus Tracker - ${activeCourse.title}`}
          size="md"
        >
          <div className="space-y-4">
            <p className="text-xs text-on-surface-variant leading-relaxed text-left">
              Check off the modules you have completed. Your dashboard progress bars will instantly recalculate.
            </p>

            <div className="space-y-2 border-t border-outline-variant pt-3 text-left">
              {activeCourse.modules.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => toggleModule(mod.id)}
                  className="w-full flex items-start gap-3 p-3 bg-white border border-outline-variant hover:border-primary rounded-xl transition-all duration-150 text-left group"
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

            <div className="flex items-center justify-between border-t border-outline-variant pt-4 mt-6">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider flex items-center gap-1">
                <FiAward className="h-4 w-4 text-primary" />
                Completion XP: {activeCourse.xpReward} XP
              </span>
              <Button variant="primary" size="sm" onClick={() => setIsModuleModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default LearningHubTab;
