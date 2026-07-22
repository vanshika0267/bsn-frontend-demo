import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { FiSend, FiMessageSquare } from 'react-icons/fi';
import { useApp } from '../../../context/AppContext';
import EmptyState from '../../../components/common/EmptyState';
import { listConversations, getConversation, sendMessage } from '../../../services/api';

const ChatTab = () => {
  const { user } = useApp();
  const location = useLocation();
  const initialTo = new URLSearchParams(location.search).get('to');

  const [conversations, setConversations] = useState([]);
  const [activeId, setActiveId] = useState(initialTo ? Number(initialTo) : null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await listConversations();
      setConversations(data || []);
      if (activeId == null && data && data.length) setActiveId(data[0].user_id);
    } catch (e) {
      setError(e.message || 'Failed to load conversations');
    }
  }, [activeId]);

  const loadThread = useCallback(async (otherId) => {
    if (otherId == null) return;
    try {
      setMessages(await getConversation(otherId));
    } catch (e) {
      setError(e.message || 'Failed to load messages');
    }
  }, []);

  useEffect(() => { loadConversations(); }, [loadConversations]);
  useEffect(() => { loadThread(activeId); }, [activeId, loadThread]);

  // light polling for near-real-time updates
  useEffect(() => {
    const t = setInterval(() => {
      loadConversations();
      if (activeId != null) loadThread(activeId);
    }, 5000);
    return () => clearInterval(t);
  }, [activeId, loadConversations, loadThread]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || activeId == null) return;
    setSending(true);
    setError('');
    try {
      await sendMessage(activeId, text.trim());
      setText('');
      await loadThread(activeId);
      await loadConversations();
    } catch (e2) {
      setError(e2.message || 'Could not send message');
    } finally {
      setSending(false);
    }
  };

  const activeName = conversations.find((c) => c.user_id === activeId)?.name
    || (activeId != null ? `User ${activeId}` : '');

  return (
    <div className="bg-white rounded-xl border border-outline-variant shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 h-[70vh]">
        {/* Conversation list */}
        <div className="border-r border-outline-variant overflow-y-auto">
          <div className="p-4 border-b border-outline-variant">
            <h2 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <FiMessageSquare className="text-primary" size={16} /> Messages
            </h2>
          </div>
          {conversations.length === 0 ? (
            <p className="p-4 text-xs text-on-surface-variant">
              No conversations yet. Approved connection requests appear here.
            </p>
          ) : (
            conversations.map((c) => (
              <button
                key={c.user_id}
                onClick={() => setActiveId(c.user_id)}
                className={`w-full text-left px-4 py-3 border-b border-outline-variant hover:bg-surface transition-colors ${activeId === c.user_id ? 'bg-surface' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-on-surface">{c.name || `User ${c.user_id}`}</span>
                  {c.unread > 0 && (
                    <span className="text-[10px] font-bold text-white bg-primary rounded-full px-1.5 py-0.5">{c.unread}</span>
                  )}
                </div>
                <p className="text-[11px] text-on-surface-variant truncate mt-0.5">{c.last_message}</p>
              </button>
            ))
          )}
        </div>

        {/* Thread */}
        <div className="md:col-span-2 flex flex-col">
          {activeId == null ? (
            <div className="flex-1 flex items-center justify-center">
              <EmptyState title="No conversation selected" description="Pick a conversation to start chatting." />
            </div>
          ) : (
            <>
              <div className="p-4 border-b border-outline-variant">
                <h3 className="text-sm font-bold text-on-surface">{activeName}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-surface">
                {messages.map((m) => {
                  const mine = m.sender_id === user?.id;
                  return (
                    <div key={m.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-xs ${mine ? 'bg-primary text-white rounded-br-sm' : 'bg-white border border-outline-variant text-on-surface rounded-bl-sm'}`}>
                        {m.text}
                        <div className={`text-[9px] mt-1 ${mine ? 'text-white/70' : 'text-on-surface-variant'}`}>
                          {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
              {error && <div className="px-4 py-2 text-[11px] text-red-500 font-medium">{error}</div>}
              <form onSubmit={handleSend} className="p-3 border-t border-outline-variant flex items-center gap-2">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 px-3 py-2 rounded-lg bg-surface border border-outline-variant text-on-surface text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
                <button type="submit" disabled={sending || !text.trim()} className="px-3 py-2 bg-primary hover:bg-primary/95 disabled:opacity-50 text-white rounded-lg">
                  <FiSend size={16} />
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatTab;
