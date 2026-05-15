'use client';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState({ displayName: 'Tanishq Mangal', theme: 'dark' as string, emailNotifs: true, pushNotifs: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Admin Settings</h1>
      <div className="max-w-xl space-y-6">
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="font-bold mb-4">Profile</h3>
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm text-gray-400 mb-2">Display Name</label>
            <input id="displayName" title="Display Name" placeholder="Display Name" value={settings.displayName} onChange={(e) => setSettings({...settings, displayName: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none" />
          </div>
          <div className="mb-4">
            <label htmlFor="theme" className="block text-sm text-gray-400 mb-2">Dashboard Theme</label>
            <select id="theme" title="Theme" aria-label="Dashboard Theme" value={settings.theme} onChange={(e) => setSettings({...settings, theme: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none">
              <option value="dark">Dark</option>
              <option value="darker">Darker</option>
              <option value="midnight-blue">Midnight Blue</option>
            </select>
          </div>
        </div>
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="font-bold mb-4">Notifications</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-300">Email on new contact</span>
            <button onClick={() => setSettings({...settings, emailNotifs: !settings.emailNotifs})} className={`px-3 py-1 rounded-full text-xs ${settings.emailNotifs ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>{settings.emailNotifs ? 'ON' : 'OFF'}</button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Push notifications</span>
            <button onClick={() => setSettings({...settings, pushNotifs: !settings.pushNotifs})} className={`px-3 py-1 rounded-full text-xs ${settings.pushNotifs ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>{settings.pushNotifs ? 'ON' : 'OFF'}</button>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={() => toast.success('Settings saved!')} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-6 py-2 rounded-lg">Save</button>
          <button onClick={signOut} className="text-red-400 hover:text-red-300 px-6 py-2 rounded-lg border border-red-900/50">Sign Out</button>
        </div>
      </div>
    </div>
  );
}
