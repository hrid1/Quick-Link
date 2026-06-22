// components/SuccessState.tsx
import { useState, useEffect } from 'react';
import { Copy, Check, BarChart3, Eye, Clock, QrCode } from 'lucide-react';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';

interface SuccessStateProps {
  shortUrl: string;
  shortCode: string;
  copied: boolean;
  handleCopy: () => void;
  resetForm: () => void;
}

export default function SuccessState({ shortUrl, shortCode, copied, handleCopy, resetForm }: SuccessStateProps) {
  const [analytics, setAnalytics] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch(`/api/analytics?code=${shortCode}`);
      const data = await res.json();
      if(res.ok) setAnalytics(data);
    };
    fetchAnalytics();
  }, [shortCode]);

  return (
    <div className="text-center py-4 space-y-6">
      <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-400" />
      </div>
      
      <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700 rounded-xl p-2">
        <input type="text" readOnly value={shortUrl} className="w-full bg-transparent px-3 py-2 text-green-400 font-mono text-sm outline-none truncate"/>
        <button onClick={handleCopy} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${copied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* QR Code Section */}
      <div className="flex justify-center">
        <button 
          onClick={() => setShowQR(!showQR)}
          className="text-xs text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-1.5"
        >
          <QrCode className="w-4 h-4" />
          {showQR ? 'Hide QR Code' : 'Show QR Code'}
        </button>
      </div>

      {showQR && (
        <div className="flex justify-center animate-in fade-in duration-300">
          <div className="bg-white p-3 rounded-xl shadow-2xl">
            <QRCodeSVG value={shortUrl} size={150} bgColor="#ffffff" fgColor="#000000" level="H" />
          </div>
        </div>
      )}

      {/* Analytics Section */}
      {analytics && (
        <div className="bg-gray-800/40 border border-gray-700/50 rounded-xl p-4 text-left">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 flex items-center gap-2 border-b border-gray-700/50 pb-2">
            <BarChart3 className="w-4 h-4 text-purple-400" /> Quick Stats
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg"><Eye className="w-5 h-5 text-blue-400" /></div>
              <div>
                <p className="text-xs text-gray-500">Clicks</p>
                <p className="text-xl font-bold text-white">{analytics.clicks}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg"><Clock className="w-5 h-5 text-orange-400" /></div>
              <div>
                <p className="text-xs text-gray-500">Expires</p>
                <p className="text-sm font-semibold text-white mt-1">{format(new Date(analytics.expiresAt), "MMM d, h:mm a")}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <button onClick={resetForm} className="text-sm text-gray-500 hover:text-gray-300 underline transition-colors">
        Shorten another link
      </button>
    </div>
  );
}