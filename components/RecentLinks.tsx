// components/RecentLinks.tsx
import { useEffect, useState } from 'react';
import { Copy, Clock, ArrowUpRight, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface LinkData {
  id: string;
  shortCode: string;
  originalUrl: string;
  expiresAt: string;
  clicks: number;
}

export default function RecentLinks() {
  const [links, setLinks] = useState<LinkData[]>([]);
  const [stats, setStats] = useState({ total: 0, active: 0, expired: 0 });

  const fetchLinks = async () => {
    const res = await fetch('/api/links');
    const data = await res.json();
    if(data.links) {
      setLinks(data.links);
      setStats(data.stats);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (links.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 animate-in fade-in duration-500">
      
      {/* Header & Stats */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Links</h3>
          <p className="text-xs text-gray-500 mt-1">Your recently created links</p>
        </div>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-green-400 font-medium">Active</p>
            <p className="text-lg font-bold text-white">{stats.active}</p>
          </div>
          <div className="w-px bg-gray-800"></div>
          <div className="text-right">
            <p className="text-xs text-red-400 font-medium">Expired</p>
            <p className="text-lg font-bold text-white">{stats.expired}</p>
          </div>
          <div className="w-px bg-gray-800"></div>
          <div className="text-right">
            <p className="text-xs text-gray-400 font-medium">Total</p>
            <p className="text-lg font-bold text-white">{stats.total}</p>
          </div>
        </div>
      </div>

      {/* Links List */}
      <div className="space-y-3">
        {links.map((link) => {
          const isExpired = new Date(link.expiresAt) < new Date();
          return (
            <div key={link.id} className="flex items-center justify-between bg-gray-900/40 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 group hover:border-gray-700/50 transition-all">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isExpired ? 'bg-red-500/80' : 'bg-green-500/80'}`}></div>
                <div className="min-w-0">
                  <p className="text-sm text-white font-mono truncate">
                    /{link.shortCode}
                  </p>
                  <p className="text-xs text-gray-600 truncate mt-0.5">{link.originalUrl}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-5 shrink-0 ml-4">
                <div className="hidden sm:flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><ArrowUpRight className="w-3 h-3"/>{link.clicks}</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3"/>{format(new Date(link.expiresAt), "MMM d")}</span>
                </div>
                
                <button 
                  onClick={() => handleCopy(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/${link.shortCode}`)}
                  className="opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-white/5 rounded-lg"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}