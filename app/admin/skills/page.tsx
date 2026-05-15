'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getSkills, updateSkill, addSkillCategory, deleteSkillCategory } from '@/lib/firestore/portfolio';
import type { SkillCategory } from '@/types/portfolio';

export default function SkillsPage() {
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});

  useEffect(() => {
    getSkills().then(setCategories);
  }, []);

  const addSkill = async (catId: string) => {
    const val = newSkill[catId];
    if (!val) return;
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    const newItems = [...cat.items, val];
    setCategories(cats => cats.map(c => c.id === catId ? {...c, items: newItems} : c));
    setNewSkill({...newSkill, [catId]: ''});
    await updateSkill(catId, { items: newItems });
  };

  const removeSkill = async (catId: string, idx: number) => {
    const cat = categories.find(c => c.id === catId);
    if (!cat) return;
    const newItems = cat.items.filter((_,i)=>i!==idx);
    setCategories(cats => cats.map(c => c.id === catId ? {...c, items: newItems} : c));
    await updateSkill(catId, { items: newItems });
  };

  const handleAddCategory = async () => {
    const newCat = { name: 'New Category', items: [], sortOrder: categories.length };
    const id = await addSkillCategory(newCat);
    setCategories([...categories, { id, ...newCat }]);
  };

  const handleUpdateCategoryName = async (catId: string, name: string) => {
    setCategories(cats => cats.map(c => c.id === catId ? {...c, name} : c));
    await updateSkill(catId, { name });
  };

  const handleDeleteCategory = async (catId: string, name: string) => {
    if(confirm(`Delete "${name}"?`)) {
      setCategories(cats => cats.filter(c => c.id !== catId));
      await deleteSkillCategory(catId);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-heading">Skills</h1>
        <button onClick={handleAddCategory} className="bg-orange-400/20 text-orange-400 px-4 py-2 rounded-lg hover:bg-orange-400/30 text-sm">+ Add Category</button>
      </div>
      <div className="space-y-4">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl p-4 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
            <div className="flex justify-between items-center mb-3">
              <input title="Category Name" aria-label="Category Name" value={cat.name} onChange={(e) => handleUpdateCategoryName(cat.id, e.target.value)} className="bg-transparent text-lg font-bold text-white border-b border-transparent focus:border-orange-400 focus:outline-none" />
              <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="text-red-400 hover:text-red-300 text-sm">Delete</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {cat.items.map((skill, i) => (
                <span key={i} className="bg-gray-700/50 px-3 py-1 rounded-lg text-sm flex items-center gap-1 group">
                  {skill}
                  <button onClick={() => removeSkill(cat.id, i)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-1">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input title="Add skill" aria-label="Add skill" placeholder="Add skill..." value={newSkill[cat.id] || ''} onChange={(e) => setNewSkill({...newSkill, [cat.id]: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && addSkill(cat.id)} className="flex-1 bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-orange-400 focus:outline-none" />
              <button onClick={() => addSkill(cat.id)} className="text-orange-400 text-sm px-3">Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
