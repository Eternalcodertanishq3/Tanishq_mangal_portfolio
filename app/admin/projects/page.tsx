'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getProjects, updateProject, softDeleteProject, addProject } from '@/lib/firestore/portfolio';
import type { Project } from '@/types/portfolio';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const openEdit = (proj: Project) => {
    setCurrentProject(proj);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setCurrentProject({
      title: '',
      subtitle: '',
      description: '',
      technologies: [],
      imageUrl: '',
      liveUrl: '',
      sourceUrl: '',
      sortOrder: projects.length,
      isVisible: true,
      isFeatured: false,
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving project...');
    try {
      if (currentProject.id) {
        await updateProject(currentProject.id, currentProject);
        setProjects(p => p.map(x => x.id === currentProject.id ? { ...x, ...currentProject } as Project : x));
        toast.success('Project updated!', { id: loadingToast });
      } else {
        const id = await addProject(currentProject as any);
        setProjects([...projects, { ...currentProject, id, createdAt: new Date(), updatedAt: new Date() } as any]);
        toast.success('Project added!', { id: loadingToast });
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save project', { id: loadingToast });
    }
  };

  const toggleVisibility = async (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setProjects(p => p.map(p2 => p2.id === id ? {...p2, isVisible: !p2.isVisible} : p2));
    await updateProject(id, { isVisible: !proj.isVisible });
  };

  const toggleFeatured = async (id: string) => {
    const proj = projects.find(p => p.id === id);
    if (!proj) return;
    setProjects(p => p.map(p2 => p2.id === id ? {...p2, isFeatured: !p2.isFeatured} : p2));
    await updateProject(id, { isFeatured: !proj.isFeatured });
  };

  const handleDelete = async (id: string) => {
    if(confirm('Are you sure you want to delete this project?')) {
      setProjects(p => p.filter(x => x.id !== id));
      await softDeleteProject(id);
      toast.success('Project deleted');
    }
  };

  return (
    <div className="pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-heading">Projects</h1>
        <button onClick={openAdd} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">+ Add New Project</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map((proj) => (
          <div key={proj.id} className="rounded-xl p-4 border border-gray-800 flex items-center justify-between bg-[rgba(12,12,28,0.85)] hover:border-gray-700 transition-colors">
            <div>
              <h3 className="font-bold text-white text-lg">{proj.title}</h3>
              <p className="text-gray-400 text-sm">{proj.subtitle}</p>
              <div className="flex gap-2 mt-3">
                <button onClick={() => toggleVisibility(proj.id)} className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${proj.isVisible ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>
                  {proj.isVisible ? '● Visible' : '○ Hidden'}
                </button>
                <button onClick={() => toggleFeatured(proj.id)} className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${proj.isFeatured ? 'bg-yellow-400/20 text-yellow-400' : 'bg-gray-700/50 text-gray-500'}`}>
                  {proj.isFeatured ? '★ Featured' : '☆ Featured'}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(proj)} className="text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded-md border border-gray-700 hover:bg-gray-800 transition-all">Edit</button>
              <button onClick={() => handleDelete(proj.id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-md border border-gray-700 hover:bg-red-400/10 transition-all">🗑</button>
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
                <h2 className="text-2xl font-bold font-heading">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="proj-title" className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                  <input 
                    id="proj-title"
                    type="text" 
                    required
                    title="Project Title"
                    placeholder="e.g. My Awesome App"
                    value={currentProject.title || ''} 
                    onChange={e => setCurrentProject({...currentProject, title: e.target.value})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="proj-subtitle" className="block text-sm font-medium text-gray-400 mb-1">Subtitle</label>
                  <input 
                    id="proj-subtitle"
                    type="text" 
                    title="Subtitle"
                    placeholder="e.g. A next-gen social platform"
                    value={currentProject.subtitle || ''} 
                    onChange={e => setCurrentProject({...currentProject, subtitle: e.target.value})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="proj-description" className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea 
                    id="proj-description"
                    rows={4}
                    title="Description"
                    placeholder="Detailed description of the project..."
                    value={currentProject.description || ''} 
                    onChange={e => setCurrentProject({...currentProject, description: e.target.value})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="proj-tech" className="block text-sm font-medium text-gray-400 mb-1">Technologies (comma separated)</label>
                  <input 
                    id="proj-tech"
                    type="text" 
                    title="Technologies"
                    placeholder="React, Node.js, Firebase..."
                    value={currentProject.technologies?.join(', ') || ''} 
                    onChange={e => setCurrentProject({...currentProject, technologies: e.target.value.split(',').map(t => t.trim())})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="proj-live" className="block text-sm font-medium text-gray-400 mb-1">Live URL</label>
                    <input 
                      id="proj-live"
                      type="text" 
                      title="Live URL"
                      placeholder="https://..."
                      value={currentProject.liveUrl || ''} 
                      onChange={e => setCurrentProject({...currentProject, liveUrl: e.target.value})}
                      className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor="proj-source" className="block text-sm font-medium text-gray-400 mb-1">Source URL</label>
                    <input 
                      id="proj-source"
                      type="text" 
                      title="Source URL"
                      placeholder="https://github.com/..."
                      value={currentProject.sourceUrl || ''} 
                      onChange={e => setCurrentProject({...currentProject, sourceUrl: e.target.value})}
                      className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="proj-image" className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                  <input 
                    id="proj-image"
                    type="text" 
                    title="Image URL"
                    placeholder="https://..."
                    value={currentProject.imageUrl || ''} 
                    onChange={e => setCurrentProject({...currentProject, imageUrl: e.target.value})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-all">
                  Save Changes
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
