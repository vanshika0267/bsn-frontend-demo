import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend } from 'react-icons/fi';

// Basic rule-based FAQ chatbot for BSN. No backend / no API key — it matches
// keywords in the user's message against a small knowledge base. Edit KB freely.
const KB = [
  { keys: ['hi', 'hello', 'hey', 'yo'], a: "Hi! I'm the BSN Assistant 🤖. Ask me about resources, opportunities, the leaderboard, your profile, or logging in." },
  { keys: ['what is bsn', 'about', 'what is this', 'biopay student'], a: "BSN (BioPay Student Network) connects college students with academic resources, internships, a merit-based leaderboard, team-finding and senior mentorship — built around verified student identity." },
  { keys: ['resource', 'notes', 'study material', 'assignment', 'project', 'upload'], a: "Open the Resources section to upload or discover notes, assignments and projects. You can search by subject and upvote helpful ones." },
  { keys: ['opportunit', 'internship', 'job', 'apply', 'hiring', 'placement'], a: "Check the Opportunities section for internships and openings — you can view details and apply right there." },
  { keys: ['leaderboard', 'points', 'rank', 'score', 'merit'], a: "The Leaderboard ranks students by merit points earned from contributions and achievements. Your points and rank also show on your profile." },
  { keys: ['team', 'group', 'teammate', 'find team'], a: "Use Team Finder to post or join teams for projects and competitions, based on the skills each team needs." },
  { keys: ['senior', 'mentor', 'alumni', 'doubt', 'ask question'], a: "Seniors' Connect lets you ask questions and get answers from seniors and alumni." },
  { keys: ['profile', 'bio', 'skills', 'badge'], a: "Open your Profile to edit your bio, skills, branch and year, and to see your points, rank and badges." },
  { keys: ['notification', 'alert'], a: "The Notifications page shows your latest alerts — opportunity matches, rank updates and replies." },
  { keys: ['setting', 'theme', 'dark mode', 'privacy'], a: "In Settings you can manage profile visibility, notification preferences and the theme." },
  { keys: ['forgot', 'reset password', 'change password', "can't log in", 'cant log in'], a: "On the login page, click 'Forgot password?'. Enter your email, then use the one-time code to set a new password." },
  { keys: ['login', 'log in', 'sign in', 'signin'], a: "Log in with your college email and password. Admin and recruiter accounts are taken to their own portals automatically." },
  { keys: ['signup', 'sign up', 'register', 'create account', 'new account'], a: "Click 'Register here' on the login page to create an account with your college email." },
  { keys: ['role', 'admin', 'recruiter', 'portal', 'persona'], a: "BSN has Student, Recruiter and Admin portals. Your portal is decided by your account, so you'll land in the right place after login." },
  { keys: ['contact', 'help', 'support', 'who do i'], a: "For help, reach out to your group lead or the BSN team — or just ask me about any section of the platform." },
  { keys: ['thank', 'thx', 'thanks'], a: "You're welcome! Anything else I can help with? 😊" },
  { keys: ['bye', 'goodbye', 'see you'], a: "Bye! Come back anytime you need help navigating BSN. 👋" },
];

const FALLBACK = "I'm still learning! I can help with: Resources, Opportunities, Leaderboard, Team Finder, Seniors' Connect, Profile, and Login & Password. Try asking about one of those.";
const CHIPS = ['What is BSN?', 'Find resources', 'Internships', 'Forgot password', 'Leaderboard'];

function botReply(text) {
  const t = text.toLowerCase();
  for (const item of KB) {
    if (item.keys.some((k) => t.includes(k))) return item.a;
  }
  return FALLBACK;
}

const ChatbotWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm the BSN Assistant 🤖. How can I help you today?" },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = (raw) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    setMessages((m) => [...m, { from: 'user', text }]);
    setInput('');
    // small delay so it feels like a reply
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'bot', text: botReply(text) }]);
    }, 350);
  };

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-20 lg:bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-500"
        >
          <FiMessageCircle size={26} />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-20 lg:bottom-5 right-5 z-50 flex h-[460px] w-[330px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10">
          {/* Header */}
          <div className="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <FiMessageCircle size={20} />
              <div>
                <p className="text-sm font-semibold leading-tight">BSN Assistant</p>
                <p className="text-[11px] text-indigo-200">Online · ask me anything</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-indigo-100 hover:text-white">
              <FiX size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.from === 'user'
                      ? 'rounded-br-sm bg-indigo-600 text-white'
                      : 'rounded-bl-sm bg-white text-gray-800 ring-1 ring-gray-200'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {/* Quick-reply chips (show after the first bot message only) */}
            {messages.length <= 1 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {CHIPS.map((c) => (
                  <button
                    key={c}
                    onClick={() => send(c)}
                    className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100"
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(); }}
            className="flex items-center gap-2 border-t border-gray-200 bg-white p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message…"
              className="flex-1 rounded-full bg-gray-100 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="submit"
              aria-label="Send"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white hover:bg-indigo-500"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatbotWidget;
