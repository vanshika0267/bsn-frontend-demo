import React, { useState, useEffect } from 'react';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import EmptyState from '../../../components/common/EmptyState';
import { listResources } from '../../../services/api';
import { FiBookOpen, FiDownload, FiExternalLink, FiLoader, FiAlertCircle } from 'react-icons/fi';

const LearningHubTab = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError('');
    listResources()
      .then((data) => {
        if (!active) return;
        setResources(Array.isArray(data?.results) ? data.results : []);
      })
      .catch((e) => active && setError(e.message || 'Failed to load learning materials.'))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);
  const calculateProgress = (modules) => {
    if (!modules || modules.length === 0) return 0;
    const completedCount = modules.filter(m => m.completed).length;
    return Math.round((completedCount / modules.length) * 100);
  };

  const handleOpenCourse = (course) => {
    navigate(`/syllabus/edit?courseId=${course.id}`);
  };

  const totalProgress = courses.length > 0
    ? Math.round(courses.reduce((acc, course) => acc + calculateProgress(course.modules), 0) / courses.length)
    : 0;

  return (
    <div className="space-y-6 text-left">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold font-poppins text-on-surface">Learning Hub</h2>
          <p className="text-xs text-on-surface-variant">Browse study materials, notes, and resources shared across the platform.</p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center gap-2 py-16 text-on-surface-variant">
          <FiLoader className="animate-spin" size={18} />
          <span className="text-sm font-semibold">Loading learning materials…</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-[#fef2f2] border border-[#fca5a5] text-[#991b1b]">
          <FiAlertCircle size={18} />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {!loading && !error && resources.length === 0 && (
        <EmptyState
          icon={FiBookOpen}
          title="No learning materials yet"
          description="Study resources shared on the platform will appear here as they are contributed."
        />
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="grid grid-cols-1 gap-5">
          {resources.map((res) => (
            <Card
              key={res.id}
              className="bg-white p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2 flex-1 text-left">
                <div className="flex items-center gap-2 flex-wrap">
                  {res.type && <Badge variant="primary">{res.type}</Badge>}
                  {res.subject && (
                    <span className="text-[10px] text-on-surface-variant font-bold tracking-wider uppercase flex items-center gap-1">
                      <FiBookOpen size={12} />
                      {res.subject}
                    </span>
                  )}
                  {res.downloads !== undefined && (
                    <span className="text-[10px] text-on-surface-variant font-semibold flex items-center gap-1">
                      <FiDownload size={12} />
                      {res.downloads} downloads
                    </span>
                  )}
                </div>
                <h3 className="text-base font-extrabold text-on-surface leading-tight font-poppins">{res.title}</h3>
                {res.description && (
                  <p className="text-xs text-on-surface-variant max-w-2xl leading-relaxed font-light">{res.description}</p>
                )}
              </div>

              <div className="w-full md:w-auto shrink-0">
                {res.file_url ? (
                  <a
                    href={res.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg border border-primary text-primary hover:bg-primary hover:text-white transition-colors"
                  >
                    <FiExternalLink size={14} />
                    <span>Open / Download</span>
                  </a>
                ) : (
                  <span className="text-[10px] text-on-surface-variant font-semibold">No file attached</span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default LearningHubTab;
