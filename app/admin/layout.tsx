'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

const navItems = [
  { label: '📊 Analytics', href: '/admin' },
  { label: '✏️ Content', children: [
    { label: 'Hero & About', href: '/admin/hero' },
    { label: 'Skills', href: '/admin/skills' },
    { label: 'Projects', href: '/admin/projects' },
    { label: 'Experience', href: '/admin/experience' },
    { label: 'Education', href: '/admin/education' },
    { label: 'Certifications', href: '/admin/certifications' },
    { label: 'Socials', href: '/admin/socials' },
  ]},
  { label: '📄 Resume', href: '/admin/resume' },
  { label: '📬 Inbox', href: '/admin/inbox' },
  { label: '🎨 Appearance', href: '/admin/appearance' },
  { label: '🔧 Site Settings', href: '/admin/site-settings' },
  { label: '🔒 Security', href: '/admin/security' },
  { label: '⚙️ Admin Settings', href: '/admin/settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [contentExpanded, setContentExpanded] = useState(true);

  if (pathname === '/admin/login') return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-[#0a0a1a]">
      <Toaster position="top-right" toastOptions={{ style: { background: '#1a1a2e', color: '#e5e7eb', border: '1px solid rgba(255,154,36,0.2)' } }} />

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} transition-all duration-300 border-r border-gray-800 flex flex-col bg-[#0d0d1f]`}>
        <div className="p-4 border-b border-gray-800">
          <span className="text-xl font-bold font-heading text-[#ff9a24]">TM Admin</span>
        </div>
        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            if (item.children) {
              return (
                <div key={item.label}>
                  <button onClick={() => setContentExpanded(!contentExpanded)} className="w-full text-left px-3 py-2 text-gray-400 hover:text-white text-sm flex justify-between items-center">
                    {item.label} <span className="text-xs">{contentExpanded ? '▾' : '▸'}</span>
                  </button>
                  {contentExpanded && item.children.map((child) => (
                    <Link key={child.href} href={child.href} className={`block px-6 py-1.5 text-sm rounded transition-colors ${pathname === child.href ? 'text-orange-400 bg-orange-400/10' : 'text-gray-500 hover:text-gray-300'}`}>
                      {child.label}
                    </Link>
                  ))}
                </div>
              );
            }
            return (
              <Link key={item.href} href={item.href!} className={`block px-3 py-2 text-sm rounded transition-colors ${pathname === item.href ? 'text-orange-400 bg-orange-400/10' : 'text-gray-400 hover:text-white'}`}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-14 border-b border-gray-800 flex items-center justify-between px-4 bg-[#0d0d1f]">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-400 hover:text-white text-lg">≡</button>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-sm text-gray-400 hover:text-white flex items-center gap-1">👁 Preview</a>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">{user?.email}</span>
              <button onClick={() => { signOut(); router.push('/admin/login'); }} className="text-xs text-red-400 hover:text-red-300">Sign Out</button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
