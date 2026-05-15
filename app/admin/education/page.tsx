'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getEducation, updateEducation } from '@/lib/firestore/portfolio';

export default function EducationPage() {
  const [form, setForm] = useState({ degree: '', institution: '', location: '', timeline: '', gpa: '' });

  useEffect(() => {
    getEducation().then(edu => {
      if (edu) setForm({ degree: edu.degree || '', institution: edu.institution || '', location: edu.location || '', timeline: edu.timeline || '', gpa: edu.gpa || '' });
    });
  }, []);

  const handleSave = async () => {
    await updateEducation(form);
    toast.success('Education saved!');
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Education</h1>
      <div className="max-w-xl rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
        {['degree', 'institution', 'location', 'timeline', 'gpa'].map((field) => (
          <div key={field} className="mb-4">
            <label htmlFor={field} className="block text-sm text-gray-400 mb-2 capitalize">{field === 'gpa' ? 'GPA/Score (optional)' : field}</label>
            <input id={field} title={field} aria-label={field} placeholder={field} value={form[field as keyof typeof form]} onChange={(e) => setForm({...form, [field]: e.target.value})} className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-orange-400 focus:outline-none" />
          </div>
        ))}
        <button onClick={handleSave} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-6 py-2 rounded-lg">Save</button>
      </div>
    </div>
  );
}
