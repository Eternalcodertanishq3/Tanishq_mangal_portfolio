'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSEOSettings, updateSEOSettings, getContactFormSettings, updateContactFormSettings, getAnalyticsSettings, updateAnalyticsSettings } from '@/lib/firestore/portfolio';

export default function SiteSettingsPage() {
  const [seo, setSeo] = useState({ pageTitle: '', metaDescription: '', ogTitle: '', ogDescription: '', keywords: '' });
  const [contactEnabled, setContactEnabled] = useState(true);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);

  useEffect(() => {
    Promise.all([getSEOSettings(), getContactFormSettings(), getAnalyticsSettings()]).then(([seoCfg, contactCfg, analyticsCfg]) => {
      if (seoCfg) {
        setSeo({
          pageTitle: seoCfg.pageTitle || '',
          metaDescription: seoCfg.metaDescription || '',
          ogTitle: seoCfg.ogTitle || '',
          ogDescription: seoCfg.ogDescription || '',
          keywords: seoCfg.keywords || '',
        });
      }
      if (contactCfg !== null && contactCfg.enabled !== undefined) setContactEnabled(contactCfg.enabled);
      if (analyticsCfg !== null && analyticsCfg.enabled !== undefined) setAnalyticsEnabled(analyticsCfg.enabled);
    });
  }, []);

  const handleSave = async () => {
    try {
      await Promise.all([
        updateSEOSettings(seo),
        updateContactFormSettings({ enabled: contactEnabled }),
        updateAnalyticsSettings({ enabled: analyticsEnabled }),
      ]);
      toast.success('Settings saved!');
    } catch (e) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Site Settings</h1>
      <div className="space-y-6 max-w-2xl">
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="font-bold mb-4">SEO</h3>
          {Object.entries(seo).map(([key, val]) => (
            <div key={key} className="mb-4">
              <label htmlFor={key} className="block text-sm text-gray-400 mb-1 capitalize">{key.replace(/([A-Z])/g, ' $1')}</label>
              {key.includes('Description') ? (
                <textarea id={key} title={key} aria-label={key} placeholder={key} rows={2} value={val} onChange={(e) => setSeo({...seo, [key]: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none text-sm" />
              ) : (
                <input id={key} title={key} aria-label={key} placeholder={key} value={val} onChange={(e) => setSeo({...seo, [key]: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none text-sm" />
              )}
            </div>
          ))}
        </div>
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="font-bold mb-4">Toggles</h3>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-300">Contact Form</span>
            <button onClick={() => setContactEnabled(!contactEnabled)} className={`px-3 py-1 rounded-full text-xs ${contactEnabled ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>{contactEnabled ? 'ON' : 'OFF'}</button>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-300">Analytics Collection</span>
            <button onClick={() => setAnalyticsEnabled(!analyticsEnabled)} className={`px-3 py-1 rounded-full text-xs ${analyticsEnabled ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>{analyticsEnabled ? 'ON' : 'OFF'}</button>
          </div>
        </div>
        <button onClick={handleSave} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-6 py-2 rounded-lg">Save Settings</button>
      </div>
    </div>
  );
}
