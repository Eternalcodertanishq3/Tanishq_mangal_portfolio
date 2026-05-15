'use client';
import { useState, useEffect } from 'react';
import { onContactsChange, updateContact } from '@/lib/firestore/portfolio';
import type { ContactSubmission } from '@/types/portfolio';

export default function InboxPage() {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [messages, setMessages] = useState<ContactSubmission[]>([]);

  useEffect(() => {
    const unsubscribe = onContactsChange((contacts) => {
      setMessages(contacts);
    });
    return () => unsubscribe();
  }, []);

  const selectedMsg = messages.find(m => m.id === selected);
  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'starred') return m.isStarred;
    return true;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Inbox</h1>
      <div className="flex gap-2 mb-4">
        {['all', 'unread', 'starred'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded text-sm capitalize ${filter === f ? 'bg-orange-400/20 text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}>{f}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-[350px_1fr] gap-4 min-h-[500px]">
        <div className="space-y-1 overflow-y-auto max-h-[600px] rounded-xl border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          {filtered.map((msg) => (
            <div key={msg.id} onClick={() => { setSelected(msg.id); setMessages(ms => ms.map(m => m.id === msg.id ? {...m, isRead: true} : m)); updateContact(msg.id, { isRead: true }); }} className={`p-3 cursor-pointer transition-colors border-b border-gray-800 ${selected === msg.id ? 'bg-orange-400/10' : 'hover:bg-gray-800/50'} ${!msg.isRead ? 'border-l-2 border-l-orange-400' : ''}`}>
              <div className="flex justify-between">
                <span className={`text-sm ${!msg.isRead ? 'font-bold text-white' : 'text-gray-300'}`}>{msg.name}</span>
                <span className="text-xs text-gray-500">{msg.timestamp?.toDate().toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-1">{msg.message}</p>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          {selectedMsg ? (
            <div>
              <h2 className="text-xl font-bold text-white mb-1">{selectedMsg.name}</h2>
              <p className="text-gray-400 text-sm mb-1">{selectedMsg.email}</p>
              <p className="text-gray-500 text-xs mb-6">{selectedMsg.timestamp?.toDate().toLocaleString()}</p>
              <p className="text-gray-300 leading-relaxed">{selectedMsg.message}</p>
              <div className="flex gap-2 mt-6">
                <a href={`mailto:${selectedMsg.email}`} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">Reply via Email</a>
                <button onClick={() => { setMessages(ms => ms.map(m => m.id === selectedMsg.id ? {...m, isStarred: !m.isStarred} : m)); updateContact(selectedMsg.id, { isStarred: !selectedMsg.isStarred }); }} className="text-gray-400 hover:text-yellow-400 px-3 py-2 rounded-lg border border-gray-700 text-sm">{selectedMsg.isStarred ? '★ Unstar' : '☆ Star'}</button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">Select a message to read</div>
          )}
        </div>
      </div>
    </div>
  );
}
