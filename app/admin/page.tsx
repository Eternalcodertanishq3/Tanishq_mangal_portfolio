'use client';

import { useState, useEffect } from 'react';
import { getUnreadCount, seedInitialData, getPortfolioConfig } from '@/lib/firestore/portfolio';

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState<string>('30D');
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [isSeeding, setIsSeeding] = useState(false);
  const [hasData, setHasData] = useState(true);

  useEffect(() => {
    getUnreadCount().then(setUnreadCount);
    getPortfolioConfig().then(config => setHasData(!!config));
  }, []);

  const handleSeed = async () => {
    if (!confirm('This will populate your database with initial data. Continue?')) return;
    setIsSeeding(true);
    try {
      await seedInitialData();
      alert('Database seeded successfully! Refreshing...');
      window.location.reload();
    } catch (error) {
      console.error('Seeding error:', error);
      alert('Error seeding database.');
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold font-heading">Analytics Dashboard</h1>
        {!hasData && (
          <button 
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {isSeeding ? 'Seeding...' : '🌱 Seed Initial Data'}
          </button>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <div className="rounded-xl p-4 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <p className="text-xs text-gray-500 mb-1">📬 Unread Messages</p>
          <p className="text-2xl font-bold text-white">{unreadCount}</p>
          <p className="text-xs text-gray-400 mt-1">Live from Inbox</p>
        </div>
        <div className="rounded-xl p-4 border border-gray-800 bg-[rgba(12,12,28,0.85)] opacity-50">
          <p className="text-xs text-gray-500 mb-1">👁 Total Visitors</p>
          <p className="text-2xl font-bold text-white">—</p>
          <p className="text-xs text-gray-400 mt-1">Pending Analytics Sync</p>
        </div>
      </div>

      {/* Charts placeholder */}
      <div className="rounded-xl p-6 border border-gray-800 mb-6 bg-[rgba(12,12,28,0.85)]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Daily Visitors</h3>
          <div className="flex gap-2">
            {['7D', '30D', '90D', 'ALL'].map((r) => (
              <button key={r} onClick={() => setTimeRange(r)} className={`px-3 py-1 rounded text-sm ${timeRange === r ? 'bg-orange-400/20 text-orange-400' : 'text-gray-500 hover:text-gray-300'}`}>{r}</button>
            ))}
          </div>
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <p>📊 Chart will render with Recharts when Firebase is connected</p>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {['Device Breakdown', 'Top Sections', 'Browser Distribution'].map((title) => (
          <div key={title} className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
            <h3 className="text-sm font-bold mb-4">{title}</h3>
            <div className="h-40 flex items-center justify-center text-gray-500 text-sm">Chart placeholder</div>
          </div>
        ))}
      </div>

      {/* Live & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="text-sm font-bold mb-4">🟢 Live Visitors</h3>
          <p className="text-4xl font-bold text-green-400">0</p>
          <p className="text-xs text-gray-500 mt-2">Active in last 5 minutes</p>
        </div>
        <div className="rounded-xl p-6 border border-gray-800 bg-[rgba(12,12,28,0.85)]">
          <h3 className="text-sm font-bold mb-4">Recent Activity</h3>
          <p className="text-gray-500 text-sm">No recent activity. Connect Firebase to see live data.</p>
        </div>
      </div>
    </div>
  );
}
