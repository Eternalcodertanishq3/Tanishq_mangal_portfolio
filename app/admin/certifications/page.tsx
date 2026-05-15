'use client';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getCertifications, updateCertification, softDeleteCertification, addCertification } from '@/lib/firestore/portfolio';
import type { Certification } from '@/types/portfolio';

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCert, setCurrentCert] = useState<Partial<Certification>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getCertifications().then(setCerts);
  }, []);

  const openEdit = (cert: Certification) => {
    setCurrentCert(cert);
    setIsModalOpen(true);
  };

  const openAdd = () => {
    setCurrentCert({
      name: '',
      issuer: '',
      sortOrder: certs.length,
      isVisible: true,
    });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const loadingToast = toast.loading('Processing image...');

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          setCurrentCert({ ...currentCert, credentialUrl: dataUrl });
          
          setUploading(false);
          toast.success('Image ready!', { id: loadingToast });
        };
      };
    } catch (err) {
      toast.error('Failed to process image');
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const loadingToast = toast.loading('Saving certification...');
    try {
      if (currentCert.id) {
        await updateCertification(currentCert.id, currentCert);
        setCerts(c => c.map(x => x.id === currentCert.id ? { ...x, ...currentCert } as Certification : x));
        toast.success('Certification updated!', { id: loadingToast });
      } else {
        const id = await addCertification(currentCert as any);
        setCerts([...certs, { ...currentCert, id } as any]);
        toast.success('Certification added!', { id: loadingToast });
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error('Failed to save certification. Note: File might be too large (>1MB).', { id: loadingToast });
    }
  };

  const toggleVisibility = async (id: string) => {
    const cert = certs.find(c => c.id === id);
    if (!cert) return;
    setCerts(c => c.map(c2 => c2.id === id ? {...c2, isVisible: !c2.isVisible} : c2));
    await updateCertification(id, { isVisible: !cert.isVisible });
  };

  const handleDelete = async (id: string) => {
    if(confirm('Delete this certification?')) {
      setCerts(c => c.filter(x => x.id !== id));
      await softDeleteCertification(id);
      toast.success('Certification deleted');
    }
  };

  return (
    <div className="pb-12">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-heading">Certifications</h1>
        <button onClick={openAdd} className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 rounded-lg text-sm">+ Add Certification</button>
      </div>

      <div className="space-y-3">
        {certs.map((cert) => (
          <div key={cert.id} className="rounded-xl p-4 border border-gray-800 flex items-center justify-between bg-[rgba(12,12,28,0.85)] hover:border-gray-700 transition-colors">
            <div>
              <h3 className="font-bold text-white text-lg">{cert.name}</h3>
              <p className="text-gray-400 text-sm">{cert.issuer}</p>
              <div className="mt-2">
                <button onClick={() => toggleVisibility(cert.id)} className={`text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter ${cert.isVisible ? 'bg-green-400/20 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>
                  {cert.isVisible ? 'Visible' : 'Hidden'}
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(cert)} className="text-gray-300 hover:text-white text-sm px-3 py-1.5 rounded-md border border-gray-700 hover:bg-gray-800 transition-all">Edit</button>
              <button onClick={() => handleDelete(cert.id)} className="text-red-400 hover:text-red-300 text-sm px-3 py-1.5 rounded-md border border-gray-700 hover:bg-red-400/10 transition-all">🗑</button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0c0c1c] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl">
            <form onSubmit={handleSave} className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold font-heading">{currentCert.id ? 'Edit Certification' : 'New Certification'}</h2>
                <button type="button" onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-white">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="cert-name" className="block text-sm font-medium text-gray-400 mb-1">Certification Name</label>
                  <input 
                    id="cert-name"
                    type="text" 
                    required
                    title="Certification Name"
                    placeholder="e.g. AWS Certified Developer"
                    value={currentCert.name || ''} 
                    onChange={e => setCurrentCert({...currentCert, name: e.target.value})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="cert-issuer" className="block text-sm font-medium text-gray-400 mb-1">Issuer</label>
                  <input 
                    id="cert-issuer"
                    type="text" 
                    required
                    title="Issuer"
                    placeholder="e.g. Amazon Web Services"
                    value={currentCert.issuer || ''} 
                    onChange={e => setCurrentCert({...currentCert, issuer: e.target.value})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Upload Certificate (Direct to DB)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="file" 
                      onChange={handleFileUpload}
                      className="hidden" 
                      id="cert-file"
                      accept="image/*"
                    />
                    <label htmlFor="cert-file" className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 px-4 py-2 rounded-lg cursor-pointer text-sm border border-orange-400/30 transition-all">
                      {uploading ? 'Processing...' : '📁 Choose Certificate Image'}
                    </label>
                    {currentCert.credentialUrl?.startsWith('data:') && (
                      <span className="text-green-400 text-xs font-bold animate-pulse">✓ Ready to Save</span>
                    )}
                  </div>
                </div>
                <div>
                  <label htmlFor="cert-link" className="block text-sm font-medium text-gray-400 mb-1">Or Certificate Link (URL)</label>
                  <input 
                    id="cert-link"
                    type="text" 
                    title="Certificate Link"
                    placeholder="https://..."
                    value={currentCert.credentialUrl || ''} 
                    onChange={e => setCurrentCert({...currentCert, credentialUrl: e.target.value})}
                    className="w-full bg-[#050510] border border-gray-800 rounded-lg px-4 py-2 text-white focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="submit" className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-bold py-3 rounded-xl transition-all">
                  Save Certification
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
