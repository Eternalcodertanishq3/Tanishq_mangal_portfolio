'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function ResumePage() {
  const [fileName] = useState('Tanishq Mangal - Resume.pdf');
  const [uploading, setUploading] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-heading">Resume</h1>
      <div className="max-w-xl rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
        <div className="mb-6">
          <h3 className="text-sm text-gray-400 mb-3">Current Resume</h3>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-800/30 border border-gray-700">
            <span className="text-3xl">📄</span>
            <div className="flex-1">
              <p className="text-white font-semibold">{fileName}</p>
              <p className="text-gray-500 text-sm">167 KB · Uploaded recently</p>
            </div>
            <a href="/Tanishq Mangal - Resume.pdf" target="_blank" className="text-orange-400 hover:text-orange-300 text-sm">View PDF</a>
          </div>
        </div>
        <div className="border-2 border-dashed border-gray-700 rounded-lg p-8 text-center hover:border-orange-400/50 transition-colors cursor-pointer">
          <p className="text-gray-400 mb-2">Drag & drop your resume here, or click to upload</p>
          <p className="text-gray-600 text-xs">PDF only · Max 10MB</p>
          <input type="file" aria-label="Upload Resume" title="Upload Resume" accept=".pdf" className="hidden" />
        </div>
        <p className="text-yellow-500/70 text-xs mt-3">⚠️ Uploading a new file will replace the current resume on the live site immediately.</p>
      </div>
    </div>
  );
}
