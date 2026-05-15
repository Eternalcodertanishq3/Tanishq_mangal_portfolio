'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getExperiences, updateExperience, softDeleteExperience, addExperience } from '@/lib/firestore/portfolio';
import type { Experience } from '@/types/portfolio';

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExp, setCurrentExp] = useState<Partial<Experience>>({});

  useEffect(() => {
    getExperiences().then(setExperiences);
  }, []);

  const openEdit = (exp: Experience) => {
    setCurrentExp(exp);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setCurrentExp({
      position: '',
      company: '',
      location: '',
      duration: '',
      achievements: [],
      sortOrder: experiences.length,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving experience...');
    try {
      if (currentExp.id) {
        await updateExperience(currentExp.id, currentExp);
        setExperiences(exps => exps.map(x => x.id === currentExp.id ? { ...x, ...currentExp } as Experience : x));
        toast.success('Experience updated!', { id: loadingToast });
      } else {
        const id = await addExperience(currentExp as any);
        setExperiences([...experiences, { ...currentExp, id } as any]);
        toast.success('Experience added!', { id: loadingToast });
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save experience', { id: loadingToast });
    }
  };

  const toggleVisibility = async (id: string) => {
    const exp = experiences.find(e => e.id === id);
    if (!exp) return;
    setExperiences(e => e.map(e2 => e2.id === id ? {...e2, isVisible: !e2.isVisible} : e2));
    await updateExperience(id, { isVisible: !exp.isVisible });
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this experience entry?')) {
      setExperiences(e => e.filter(x => x.id !== id));
      await softDeleteExperience(id);
      toast.success('Experience deleted');
    }
  };

  return (
    <div className="pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-heading">Experience</h1>
        <button onClick={openAdd} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">+ Add Experience</button>
      </div>

      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="rounded-xl p-4 border border-gray-800 flex items-center justify-between bg-[rgba(12,12,28,0.85)] hover:border-gray-700 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-400/20 flex items-center justify-center text-orange-400 font-bold text-lg">{exp.company?.charAt(0) || '?'}</div>
              <div>
                <h3 className="font-bold text-white text-lg">{exp.position}</h3>
                <p className="text-gray-400 text-sm">{exp.company} · {exp.duration}</p>
                <div className="mt-2">
                  <button onClick={() => toggleVisibility(exp.id)} className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter ${exp.isVisible ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>
                    {exp.isVisible ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(exp)} className="text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded-md border border-gray-700 hover:bg-gray-800 transition-all">Edit</button>
              <button onClick={() => handleDelete(exp.id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-md border border-gray-700 hover:bg-red-400/10 transition-all">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0c0c1c] border border-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            <form onSubmit={handleSave} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-heading">{currentExp.id ? 'Edit Experience' : 'New Experience'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-position" className="block text-sm font-medium text-gray-400 mb-1">Position</label>
                    <input 
                      id="exp-position"
                      type="text" 
                      required
                      title="Position"
                      placeholder="e.g. Senior Developer"
                      value={currentExp.position || ''} 
                      onChange={e => setCurrentExp({...currentExp, position: e.target.value})}
                      className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="exp-company" className="block text-sm font-medium text-gray-400 mb-1">Company</label>
                    <input 
                      id="exp-company"
                      type="text" 
                      required
                      title="Company"
                      placeholder="e.g. Google"
                      value={currentExp.company || ''} 
                      onChange={e => setCurrentExp({...currentExp, company: e.target.value})}
                      className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="exp-duration" className="block text-sm font-medium text-gray-400 mb-1">Duration (e.g. 2021 - Present)</label>
                    <input 
                      id="exp-duration"
                      type="text" 
                      title="Duration"
                      placeholder="e.g. 2021 - Present"
                      value={currentExp.duration || ''} 
                      onChange={e => setCurrentExp({...currentExp, duration: e.target.value})}
                      className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="exp-location" className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                    <input 
                      id="exp-location"
                      type="text" 
                      title="Location"
                      placeholder="e.g. Mountain View, CA"
                      value={currentExp.location || ''} 
                      onChange={e => setCurrentExp({...currentExp, location: e.target.value})}
                      className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="exp-achievements" className="block text-sm font-medium text-gray-400 mb-1">Achievements (one per line)</label>
                  <textarea 
                    id="exp-achievements"
                    rows={6}
                    title="Achievements"
                    value={currentExp.achievements?.join('\n') || ''} 
                    onChange={e => setCurrentExp({...currentExp, achievements: e.target.value.split('\n').filter(a => a.trim())})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none font-mono text-sm"
                    placeholder="• Developed a scalable API..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-all">
                  Save Experience
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition-all">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
