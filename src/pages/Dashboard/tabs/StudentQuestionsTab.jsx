import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Modal from '../../../components/common/Modal';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import EmptyState from '../../../components/common/EmptyState';
import { listSeniorQuestions, answerQuestion } from '../../../services/api';
import {
  FiMessageSquare,
  FiClock,
  FiAlertCircle,
  FiLoader,
  FiCheckCircle,
} from 'react-icons/fi';

const StudentQuestionsTab = () => {
  const { user } = useApp();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [answeredIds, setAnsweredIds] = useState([]);

  const loadQuestions = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listSeniorQuestions();
      setQuestions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Failed to load questions.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const openAnswerModal = (q) => {
    setSelectedQuestion(q);
    setAnswerText('');
    setSubmitError('');
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerText.trim() || !selectedQuestion) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      await answerQuestion(selectedQuestion.id, user.id, answerText.trim());
      setAnsweredIds((prev) => [...prev, selectedQuestion.id]);
      setSelectedQuestion(null);
      setAnswerText('');
    } catch (err) {
      setSubmitError(err.message || 'Failed to post answer.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Student Questions</h2>
          <p className="text-xs text-on-surface-variant">
            Answer questions from students to share your experience and build your community footprint.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={loadQuestions} className="cursor-pointer flex-shrink-0">Refresh</Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-error text-xs font-semibold bg-[#fef2f2] border border-[#fca5a5] rounded-lg px-3 py-2">
          <FiAlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-12 text-on-surface-variant text-sm">
          <FiLoader className="animate-spin" size={16} />
          <span>Loading questions...</span>
        </div>
      ) : questions.length === 0 ? (
        <EmptyState
          icon={FiMessageSquare}
          title="No questions yet"
          description="When students post questions, they will show up here for you to answer."
          actionText="Refresh"
          onActionClick={loadQuestions}
        />
      ) : (
        <div className="space-y-4">
          {questions.map((q) => {
            const answered = answeredIds.includes(q.id);
            return (
              <Card key={q.id} hoverable className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs select-none">
                      {String(q.user_id || 'S').toString().charAt(0).toUpperCase()}
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-on-surface">Student question</h4>
                      {q.created_at && (
                        <p className="text-[10px] text-on-surface-variant font-semibold flex items-center gap-1">
                          <FiClock size={10} /> {new Date(q.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {answered && (
                    <Badge variant="success">
                      <FiCheckCircle size={11} className="mr-1" /> Answered
                    </Badge>
                  )}
                </div>

                <p className="text-xs font-semibold text-on-surface leading-relaxed pr-6">{q.question}</p>

                <div className="border-t border-outline-variant pt-3 flex items-center justify-end">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => openAnswerModal(q)}
                    className="cursor-pointer"
                  >
                    {answered ? 'Add another answer' : 'Answer'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={!!selectedQuestion}
        onClose={() => setSelectedQuestion(null)}
        title="Answer Student Question"
        size="md"
      >
        <form onSubmit={handleAnswerSubmit} className="space-y-4">
          <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant">
            <p className="text-xs font-bold text-on-surface-variant mb-1">Student Question:</p>
            <p className="text-xs font-semibold text-on-surface leading-relaxed">{selectedQuestion?.question}</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-on-surface-variant">Your Answer</label>
            <textarea
              rows="4"
              placeholder="Share your experience, advice, or resources to help this student..."
              value={answerText}
              onChange={(e) => setAnswerText(e.target.value)}
              className="w-full border border-outline-variant rounded-lg text-xs font-semibold text-on-surface p-3 focus:outline-none focus:border-primary"
              required
            />
          </div>

          {submitError && (
            <div className="flex items-center gap-2 text-error text-xs font-semibold">
              <FiAlertCircle size={14} />
              <span>{submitError}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" size="sm" onClick={() => setSelectedQuestion(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" disabled={submitting} className="cursor-pointer">
              {submitting ? 'Submitting...' : 'Submit Answer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default StudentQuestionsTab;
