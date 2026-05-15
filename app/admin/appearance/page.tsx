'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getPortfolioConfig, updatePortfolioConfig } from '@/lib/firestore/portfolio';

export default function AppearancePage() {
  const [colors, setColors] = useState({ primaryGlow: '#ff9a24', secondaryGlow: '#4f46e5', bgColor: '#000005' });
  const [bh, setBh] = useState({ bloomIntensity: 1.2, diskRotationSpeed: 0.5, jetOpacity: 1.0, starCount: 20000 });
  const [maintenance, setMaintenance] = useState(false);

  useEffect(() => {
    getPortfolioConfig().then(cfg => {
      if (cfg) {
        setColors({ primaryGlow: cfg.primaryGlow || '#ff9a24', secondaryGlow: cfg.secondaryGlow || '#4f46e5', bgColor: cfg.bgColor || '#000005' });
        setBh({ bloomIntensity: cfg.bloomIntensity ?? 1.2, diskRotationSpeed: cfg.diskRotationSpeed ?? 0.5, jetOpacity: cfg.jetOpacity ?? 1.0, starCount: cfg.starCount ?? 20000 });
        setMaintenance(cfg.maintenanceMode || false);
      }
    });
  }, []);

  const handleSave = async () => {
    await updatePortfolioConfig({
      primaryGlow: colors.primaryGlow,
      secondaryGlow: colors.secondaryGlow,
      bgColor: colors.bgColor,
      bloomIntensity: bh.bloomIntensity,
      diskRotationSpeed: bh.diskRotationSpeed,
      jetOpacity: bh.jetOpacity,
      starCount: bh.starCount,
      maintenanceMode: maintenance,
    });
    toast.success('Appearance saved!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Appearance</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
            <h3 className="font-bold mb-4">Colors</h3>
            {Object.entries(colors).map(([key, val]) => (
              <div key={key} className="flex items-center gap-3 mb-3">
                <input type="color" aria-label={key} title={key} value={val} onChange={(e) => setColors({...colors, [key]: e.target.value})} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                <div><p className="text-sm text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p><p className="text-xs text-gray-500">{val}</p></div>
              </div>
            ))}
          </div>
          <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
            <h3 className="font-bold mb-4">Black Hole Settings</h3>
            {[
              { label: 'Bloom Intensity', key: 'bloomIntensity', min: 0.5, max: 2.0, step: 0.1 },
              { label: 'Disk Rotation Speed', key: 'diskRotationSpeed', min: 0.1, max: 2.0, step: 0.1 },
              { label: 'Jet Opacity', key: 'jetOpacity', min: 0, max: 1.0, step: 0.1 },
              { label: 'Star Count', key: 'starCount', min: 5000, max: 30000, step: 1000 },
            ].map((s) => (
              <div key={s.key} className="mb-4">
                <div className="flex justify-between text-sm mb-1"><span className="text-gray-400">{s.label}</span><span className="text-gray-500">{bh[s.key as keyof typeof bh]}</span></div>
                <input type="range" aria-label={s.label} title={s.label} min={s.min} max={s.max} step={s.step} value={bh[s.key as keyof typeof bh]} onChange={(e) => setBh({...bh, [s.key]: parseFloat(e.target.value)})} className="w-full accent-orange-400" />
              </div>
            ))}
          </div>
          <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
            <div className="flex justify-between items-center">
              <div><h3 className="font-bold">Maintenance Mode</h3><p className="text-gray-500 text-sm">Show coming soon page to visitors</p></div>
              <button onClick={() => setMaintenance(!maintenance)} className={`px-4 py-1 rounded-full text-sm ${maintenance ? 'bg-red-400/20 text-red-400' : 'bg-gray-700/50 text-gray-500'}`}>{maintenance ? 'ON' : 'OFF'}</button>
            </div>
          </div>
        </div>
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="text-sm text-gray-500 mb-4">LIVE PREVIEW</h3>
          <div className="rounded-lg overflow-hidden border border-gray-700 h-80 flex items-center justify-center" style={{ background: colors.bgColor }}> {/* NOSONAR */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4" style={{ background: `radial-gradient(circle, ${colors.primaryGlow}, ${colors.secondaryGlow})` }} /> {/* NOSONAR */}
              <p style={{ color: colors.primaryGlow }} className="font-bold">Theme Preview</p> {/* NOSONAR */}
            </div>
          </div>
          <button onClick={handleSave} className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold px-6 py-2 rounded-lg">Save Changes</button>
        </div>
      </div>
    </div>
  );
}
