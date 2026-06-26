import React, { useState } from 'react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { FiAward, FiShield, FiArrowRight, FiZap, FiTarget } from 'react-icons/fi';

const SkillGapFinderTab = () => {
  // Survey steps state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    stateMgmt: 2, // 1 to 5
    dbDesign: 1,
    cssLayouts: 3,
    devopsCi: 1,
    testing: 2
  });

  const [diagnosticRun, setDiagnosticRun] = useState(false);

  const questions = [
    {
      key: 'stateMgmt',
      title: 'React & State Management',
      text: 'How do you handle application state across complex React component trees?',
      options: [
        { label: 'Prop drilling only', val: 1 },
        { label: 'Standard Context API & basic local state', val: 2 },
        { label: 'Redux Toolkit, Zustand or MobX with custom hooks', val: 4 },
        { label: 'Performance-optimized selectors, middleware, and caching layers', val: 5 }
      ]
    },
    {
      key: 'dbDesign',
      title: 'Database Schema Design & Querying',
      text: 'How do you manage schemas, relationships, and index optimizations?',
      options: [
        { label: 'Basic CRUD operations using an ORM without schema planning', val: 1 },
        { label: 'Designing primary/foreign relationships, simple joins, and indexing', val: 3 },
        { label: 'Advanced SQL queries, connection pooling, and replication parameters', val: 4 },
        { label: 'Partitioning, transaction isolation levels, and execution plan optimization', val: 5 }
      ]
    },
    {
      key: 'cssLayouts',
      title: 'UI Design & Advanced CSS Patterns',
      text: 'How confident are you with responsive design systems, transitions, and accessibility?',
      options: [
        { label: 'Using simple inline styles or copy-pasting basic CSS templates', val: 2 },
        { label: 'Writing CSS flexbox/grid layouts and using framework utilities (Tailwind)', val: 3 },
        { label: 'Designing component styling tokens and configuring system properties', val: 4 },
        { label: 'Creating advanced keyframes, transitions, and strict Web Accessibility (WCAG)', val: 5 }
      ]
    },
    {
      key: 'devopsCi',
      title: 'DevOps & CI/CD Orchestration',
      text: 'How do you automate testing, builds, and cloud deployments?',
      options: [
        { label: 'Manual builds and file transfers (FTP/SSH copy-paste)', val: 1 },
        { label: 'Docker containers setup and simple GitHub Action setups', val: 3 },
        { label: 'Kubernetes orchestration, autoscaling, and private registry management', val: 4 },
        { label: 'Multi-stage pipeline automation, cloud architectures, and Terraform setups', val: 5 }
      ]
    },
    {
      key: 'testing',
      title: 'Software Testing Methodologies',
      text: 'How do you verify code reliability and component functions?',
      options: [
        { label: 'Manual verification only', val: 1 },
        { label: 'Unit testing basic components (Jest, React Testing Library)', val: 2 },
        { label: 'Integration testing, mocking requests, and API contract validations', val: 4 },
        { label: 'End-to-End browser flow suites (Playwright, Cypress) on CI runs', val: 5 }
      ]
    }
  ];

  // Calculated skills compared to target (industry standard)
  const skillsData = [
    { name: 'State Management', key: 'stateMgmt', current: answers.stateMgmt, standard: 4, course: 'Software Engineering Mastery' },
    { name: 'Database Design', key: 'dbDesign', current: answers.dbDesign, standard: 3, course: 'Discrete Mathematics Foundation' },
    { name: 'Advanced UI/CSS', key: 'cssLayouts', current: answers.cssLayouts, standard: 4, course: 'Java Development Essentials' },
    { name: 'CI/CD & Docker', key: 'devopsCi', current: answers.devopsCi, standard: 3, course: 'DevOps & Pipeline Automation' },
    { name: 'Software Testing', key: 'testing', current: answers.testing, standard: 4, course: 'Reliability Engineering' }
  ];

  const handleOptionSelect = (key, val) => {
    setAnswers(prev => ({ ...prev, [key]: val }));
    if (currentStep < questions.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setDiagnosticRun(true);
    }
  };

  const restartSurvey = () => {
    setAnswers({
      stateMgmt: 2,
      dbDesign: 1,
      cssLayouts: 3,
      devopsCi: 1,
      testing: 2
    });
    setCurrentStep(0);
    setDiagnosticRun(false);
  };

  const activeQuestion = questions[currentStep];

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left">
      <div>
        <h2 className="text-2xl font-bold font-poppins text-on-surface">Skill Gap Finder</h2>
        <p className="text-xs text-on-surface-variant">Scan your engineering competency metrics against junior developer standards and target your learning path.</p>
      </div>

      {!diagnosticRun ? (
        <Card hoverable={false} className="p-8 max-w-2xl mx-auto space-y-6 bg-white border border-outline-variant shadow-sm text-left">
          {/* Progress Indicators */}
          <div className="flex justify-between items-center text-xs text-on-surface-variant font-bold uppercase tracking-wider">
            <span>Question {currentStep + 1} of {questions.length}</span>
            <span>{Math.round(((currentStep) / questions.length) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full transition-all duration-300"
              style={{ width: `${((currentStep) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          <div className="space-y-2.5">
            <Badge variant="primary">{activeQuestion.title}</Badge>
            <h3 className="text-lg font-extrabold text-on-surface font-poppins">{activeQuestion.text}</h3>
          </div>

          {/* Option list */}
          <div className="space-y-3">
            {activeQuestion.options.map((opt) => (
              <button
                key={opt.val}
                onClick={() => handleOptionSelect(activeQuestion.key, opt.val)}
                className="w-full text-left p-4 bg-white border border-outline-variant hover:border-primary rounded-xl transition-all duration-150 text-xs font-bold text-on-surface-variant flex justify-between items-center group shadow-sm"
              >
                <span className="group-hover:text-on-surface">{opt.label}</span>
                <FiArrowRight className="h-4 w-4 text-on-surface-variant group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
          {/* Chart Section */}
          <Card hoverable={false} className="lg:col-span-2 border border-outline-variant bg-white p-6 space-y-5 shadow-sm">
            <div className="flex justify-between items-center border-b border-outline-variant pb-3">
              <h3 className="text-base font-extrabold text-on-surface font-poppins flex items-center gap-2">
                <FiTarget className="text-primary" size={18} /> Skill Competency Breakdown
              </h3>
              <Button variant="outline" size="sm" onClick={restartSurvey}>
                Retake Survey
              </Button>
            </div>

            {/* Custom SVG Comparative Bar Chart */}
            <div className="space-y-6 py-4">
              {skillsData.map((skill) => {
                const maxLevel = 5;
                const yourWidth = (skill.current / maxLevel) * 100;
                const standardWidth = (skill.standard / maxLevel) * 100;
                const isUnder = skill.current < skill.standard;

                return (
                  <div key={skill.key} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-on-surface">{skill.name}</span>
                      <div className="flex gap-3 text-[10px] uppercase">
                        <span className="text-primary font-bold">You: Lvl {skill.current}</span>
                        <span className="text-on-surface-variant">Benchmark: Lvl {skill.standard}</span>
                      </div>
                    </div>

                    {/* Chart visual row */}
                    <div className="relative h-6 bg-surface-container border border-outline-variant rounded-lg overflow-hidden">
                      {/* Standard benchmark line/overlay */}
                      <div 
                        className="absolute top-0 bottom-0 bg-surface-variant border-r-2 border-dashed border-on-surface-variant/40 transition-all duration-500" 
                        style={{ width: `${standardWidth}%` }}
                      />
                      {/* Current skill fill overlay */}
                      <div 
                        className={`absolute top-0 bottom-0 transition-all duration-500 ${
                          isUnder ? 'bg-primary/20 border-r-2 border-primary' : 'bg-success/20 border-r-2 border-success'
                        }`} 
                        style={{ width: `${yourWidth}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Legend info */}
            <div className="flex justify-center gap-6 text-[9px] uppercase tracking-wider font-bold text-on-surface-variant pt-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-4 bg-primary/20 border-r-2 border-primary rounded" />
                <span>Your Skill Level</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-4 bg-surface-variant border-r-2 border-dashed border-on-surface-variant/40 rounded" />
                <span>Required Benchmark</span>
              </div>
            </div>
          </Card>

          {/* Recommendations list */}
          <div className="space-y-5 text-left">
            <Card hoverable={false} className="border border-outline-variant bg-white p-5 space-y-4 shadow-sm">
              <h3 className="text-sm font-extrabold text-on-surface font-poppins flex items-center gap-1.5">
                <FiZap className="text-amber-500" size={16} /> Key Recommendations
              </h3>

              <div className="space-y-3">
                {skillsData.filter(s => s.current < s.standard).map(skill => (
                  <div key={skill.key} className="p-3 bg-surface border border-outline-variant rounded-xl space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-on-surface">{skill.name} Gap</span>
                      <Badge variant="error">-{skill.standard - skill.current} Levels</Badge>
                    </div>
                    <p className="text-[10px] text-on-surface-variant leading-relaxed">
                      Your score is level {skill.current}. Modern junior developer roles require benchmark level {skill.standard}.
                    </p>
                    <div className="pt-1.5 border-t border-outline-variant flex justify-between items-center">
                      <span className="text-[9px] text-on-surface-variant uppercase tracking-wide font-bold">Recommended:</span>
                      <span className="text-[10px] text-primary font-bold hover:underline cursor-pointer flex items-center gap-0.5">
                        {skill.course} <FiArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}

                {skillsData.filter(s => s.current >= s.standard).length === skillsData.length && (
                  <div className="text-center py-6">
                    <FiShield className="h-10 w-10 text-success mx-auto mb-2" />
                    <p className="text-xs font-bold text-on-surface">All targets achieved!</p>
                    <p className="text-[10px] text-on-surface-variant mt-1">Your current engineering foundation matches or exceeds standard expectation benchmarks.</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGapFinderTab;
