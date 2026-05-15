'use client';
import { useState, useEffect } from 'react';
import { getSocials, updateSocial, deleteSocial, addSocial } from '@/lib/firestore/portfolio';
import type { SocialLink } from '@/types/portfolio';

export default function SocialsPage() {
  const [socials, setSocials] = useState<SocialLink[]>([]);

  useEffect(() => {
    getSocials().then(setSocials);
  }, []);

  const toggleVisibility = async (id: string) => {
    const s = socials.find(x => x.id === id);
    if (!s) return;
    setSocials(arr => arr.map(a => a.id === id ? {...a, isVisible: !a.isVisible} : a));
    await updateSocial(id, { isVisible: !s.isVisible });
  };

  const handleAdd = async () => {
    const newSocial = {
      platform: 'Platform',
      url: 'https://',
      icon: 'link',
      sortOrder: socials.length,
      isVisible: true,
    };
    const id = await addSocial(newSocial);
    setSocials([...socials, { ...newSocial, id }]);
  };

  const handleDelete = async (id: string) => {
    if(confirm('Delete?')) {
      setSocials(arr => arr.filter(x => x.id !== id));
      await deleteSocial(id);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-heading">Social Links</h1>
        <button onClick={handleAdd} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">+ Add Social</button>
      </div>
      <div className="space-y-3">
        {socials.map((s) => (
          <div key={s.id} className="rounded-xl p-4 border border-gray-800 flex items-center justify-between bg-[rgba(12,12,28,0.85)]">
            <div>
              <h3 className="font-bold text-white">{s.platform}</h3>
              <p className="text-gray-400 text-sm truncate max-w-md">{s.url}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => toggleVisibility(s.id)} className={`text-xs px-2 py-0.5 rounded ${s.isVisible ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>{s.isVisible ? '●' : '○'}</button>
              <button className="text-gray-400 hover:text-white text-sm px-2 py-1 rounded border border-gray-700">Edit</button>
              <button onClick={() => handleDelete(s.id)} className="text-red-400 text-sm px-2 py-1 rounded border border-gray-700 hover:text-red-300">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
