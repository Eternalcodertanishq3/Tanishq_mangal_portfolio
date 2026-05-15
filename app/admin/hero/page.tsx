'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getPortfolioConfig, updatePortfolioConfig } from '@/lib/firestore/portfolio';

export default function HeroAboutPage() {
  const [form, setForm] = useState({
    heroTitle: '',
    heroSubtitle: '',
    typewriterRoles: [] as string[],
    aboutText: '',
    ctaButtonLabel: '',
  });
  const [newRole, setNewRole] = useState('');

  useEffect(() => {
    getPortfolioConfig().then(cfg => {
      if (cfg) {
        setForm({
          heroTitle: cfg.heroTitle || '',
          heroSubtitle: cfg.heroSubtitle || '',
          typewriterRoles: cfg.typewriterRoles || [],
          aboutText: cfg.aboutText || '',
          ctaButtonLabel: cfg.ctaButtonLabel || '',
        });
      }
    });
  }, []);

  const handleSave = async () => {
    await updatePortfolioConfig({
      heroTitle: form.heroTitle,
      heroSubtitle: form.heroSubtitle,
      typewriterRoles: form.typewriterRoles,
      aboutText: form.aboutText,
      ctaButtonLabel: form.ctaButtonLabel,
    });
    toast.success('Changes saved!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Hero & About</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="heroTitle" className="block text-sm text-gray-400 mb-2">Hero Title <span className="text-gray-600">({form.heroTitle.length}/40)</span></label>
            <input id="heroTitle" title="Hero Title" placeholder="Hero Title" type="text" maxLength={40} value={form.heroTitle} onChange={(e) => setForm({...form, heroTitle: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Typewriter Roles</label>
            <div className="space-y-2">
              {form.typewriterRoles.map((role, i) => (
                <div key={i} className="flex gap-2">
                  <input title={`Role ${i}`} placeholder="Role" value={role} onChange={(e) => { const r = [...form.typewriterRoles]; r[i] = e.target.value; setForm({...form, typewriterRoles: r}); }} className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none" />
                  <button onClick={() => setForm({...form, typewriterRoles: form.typewriterRoles.filter((_,j)=>j!==i)})} className="text-red-400 hover:text-red-300 px-2">×</button>
                </div>
              ))}
              <div className="flex gap-2">
                <input title="New role" placeholder="Add role..." value={newRole} onChange={(e) => setNewRole(e.target.value)} className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none" />
                <button onClick={() => { if(newRole) { setForm({...form, typewriterRoles: [...form.typewriterRoles, newRole]}); setNewRole(''); } }} className="bg-orange-400/20 text-orange-400 px-4 rounded-lg hover:bg-orange-400/30">+</button>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="aboutText" className="block text-sm text-gray-400 mb-2">About Text</label>
            <textarea id="aboutText" title="About Text" placeholder="About Text" rows={6} value={form.aboutText} onChange={(e) => setForm({...form, aboutText: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="ctaButtonLabel" className="block text-sm text-gray-400 mb-2">CTA Button Label</label>
            <input id="ctaButtonLabel" title="CTA Button Label" placeholder="CTA Button Label" value={form.ctaButtonLabel} onChange={(e) => setForm({...form, ctaButtonLabel: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none" />
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-6 py-2 rounded-lg">Save Changes</button>
            <button className="text-gray-400 hover:text-white px-6 py-2 rounded-lg border border-gray-700">Discard</button>
          </div>
        </div>
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="text-sm text-gray-500 mb-4">LIVE PREVIEW</h3>
          <div className="text-center py-12">
            <h2 className="text-4xl font-bold font-heading">{form.heroTitle}</h2>
            <p className="text-orange-400 mt-2">{form.typewriterRoles[0]}</p>
            <p className="text-gray-400 text-sm mt-8 max-w-sm mx-auto">{form.aboutText.substring(0, 150)}...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
