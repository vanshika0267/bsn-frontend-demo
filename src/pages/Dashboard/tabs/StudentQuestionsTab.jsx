import React, { useState } from 'react';
import { seniorQuestions } from '../../../data/roleMockData';
import Card from '../../../components/common/Card';
import Modal from '../../../components/common/Modal';
import InputField from '../../../components/common/InputField';
import Badge from '../../../components/common/Badge';
import { FiMessageSquare, FiTrendingUp } from 'react-icons/fi';

const StudentQuestionsTab = () => {
  const [questions, setQuestions] = useState(seniorQuestions);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [answerText, setAnswerText] = useState('');

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    setQuestions(questions.map(q => 
      q.id === selectedQuestion.id 
        ? { ...q, replies: q.replies + 1 } 
        : q
    ));
    setSelectedQuestion(null);
    setAnswerText('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-on-surface">Placement & Career Doubt Solving</h2>
        <p className="text-xs text-on-surface-variant">Help students resolve interview or skill roadblocks to build your community footprint index.</p>
      </div>

      <div className="space-y-4">
        {questions.map((q) => (
          <Card key={q.id} hoverable className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  {q.studentName.charAt(0)}
                </span>
                <div>
                  <h4 className="text-xs font-bold text-on-surface">{q.studentName}</h4>
                  <p className="text-[10px] text-on-surface-variant font-semibold">Topic: {q.topic}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-on-surface">
                <FiTrendingUp className="text-amber-500" size={13} /> {q.votes} upvotes
              </div>
            </div>

            <p className="text-xs font-semibold text-on-surface leading-relaxed pr-6">{q.question}</p>

            <div className="border-t border-outline-variant pt-3 flex items-center justify-between">
              <span className="text-[10px] text-on-surface-variant font-semibold">{q.replies} Replies solved</span>
              <button 
                onClick={() => setSelectedQuestion(q)}
                className="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white text-[10px] font-bold rounded-lg transition-colors"
              >
                Resolve Doubt
              </button>
            </div>
          </Card>
        ))}
      </div>

      {selectedQuestion && (
        <Modal 
          title="Resolve Student Question" 
          onClose={() => setSelectedQuestion(null)}
        >
          <form onSubmit={handleAnswerSubmit} className="space-y-4">
            <div className="p-3.5 bg-surface-container rounded-lg border border-outline-variant">
              <p className="text-xs font-bold text-on-surface-variant mb-1">Student Question:</p>
              <p className="text-xs font-semibold text-on-surface leading-relaxed">{selectedQuestion.question}</p>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-on-surface-variant">Your Resolution Answer</label>
              <textarea 
                rows="4"
                placeholder="Share your experience, advice, or resources to solve this roadmap question..."
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                className="w-full border border-outline-variant rounded-lg text-xs font-semibold text-on-surface p-3 focus:outline-none focus:border-primary"
                required
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setSelectedQuestion(null)}
                className="px-4 py-2 border border-outline-variant hover:bg-surface text-on-surface text-xs font-bold rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-lg transition-colors"
              >
                Submit Answer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default StudentQuestionsTab;
