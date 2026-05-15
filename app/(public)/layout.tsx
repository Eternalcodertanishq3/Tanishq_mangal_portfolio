import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tanishq Mangal | 3D Interactive Portfolio',
  description: 'Explore the interactive 3D portfolio of Tanishq Mangal, a creative technologist specializing in WebGL, Three.js, and immersive web experiences.',
  keywords: 'Tanishq Mangal, Portfolio, Black Hole, WebGL, Three.js, Creative Developer',
  openGraph: {
    type: 'website',
    url: 'https://tanishq-creates.netlify.app/',
    title: 'Tanishq Mangal | 3D Interactive Portfolio',
    description: 'A cinematic, scroll-driven portfolio featuring a real-time 3D black hole.',
    images: ['https://images.unsplash.com/photo-1614728263952-84ea256ec346?q=80&w=1200&auto=format&fit=crop'],
  },
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
