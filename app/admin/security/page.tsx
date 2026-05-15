'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function SecurityPage() {
  const [admins] = useState([{ email: 'tanishq@example.com', role: 'superadmin' }]);
  const [confirmText, setConfirmText] = useState('');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Security</h1>
      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="font-bold mb-4">Authorized Admins</h3>
          {admins.map((a, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-800/30 mb-2">
              <div><p className="text-white text-sm">{a.email}</p><p className="text-gray-500 text-xs capitalize">{a.role}</p></div>
            </div>
          ))}
          <input aria-label="Add admin email" title="Add admin email" placeholder="Add admin email..." className="w-full mt-3 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:border-orange-400 focus:outline-none" />
        </div>
        <div className="rounded-xl p-6 border border-red-900/30 bg-[rgba(20,8,8,0.85)]">
          <h3 className="font-bold text-red-400 mb-4">⚠️ Danger Zone</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div><p className="text-sm text-gray-300">Clear All Analytics Data</p><p className="text-xs text-gray-500">This action cannot be undone</p></div>
              <button className="text-red-400 text-sm px-3 py-1 rounded border border-red-900/50 hover:bg-red-400/10">Clear</button>
            </div>
            <div className="flex justify-between items-center">
              <div><p className="text-sm text-gray-300">Clear All Contact Submissions</p><p className="text-xs text-gray-500">This action cannot be undone</p></div>
              <button className="text-red-400 text-sm px-3 py-1 rounded border border-red-900/50 hover:bg-red-400/10">Clear</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
