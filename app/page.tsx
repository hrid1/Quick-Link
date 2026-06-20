// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { addHours, addDays, format } from 'date-fns';
import { Copy, Check, Link2, Zap, Shield } from 'lucide-react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [durationType, setDurationType] = useState('1d');
  const [customDate, setCustomDate] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, durationType, customDate }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');
      
      setResult(data.shortUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getExpirationPreview = () => {
    const now = new Date();
    let date: Date;
    switch (durationType) {
      case '1h': date = addHours(now, 1); break;
      case '5h': date = addHours(now, 5); break;
      case '1d': date = addDays(now, 1); break;
      case '7d': date = addDays(now, 7); break;
      case 'custom': 
        return customDate ? `Expires on: ${new Date(customDate).toLocaleDateString()}` : 'Select a date';
      default: date = addDays(now, 1);
    }
    return `Expires on: ${format(date, 'MMM d, yyyy h:mm a')}`;
  };

  return (
    <main className="relative flex flex-col items-center justify-center min-h-screen p-4 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-yellow-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              QuickLink
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            Shorten your links instantly. Set them to self-destruct after a custom timeframe.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 shadow-2xl">
          
          {!result ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Paste your long URL</label>
                <div className="relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="url" 
                    required
                    placeholder="https://example.com/my-very-long-url..."
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-200 placeholder-gray-500"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              </div>

              {/* Duration Select */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Link Lifespan</label>
                <select 
                  className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-200 appearance-none cursor-pointer"
                  value={durationType}
                  onChange={(e) => setDurationType(e.target.value)}
                >
                  <option value="1h">1 Hour</option>
                  <option value="5h">5 Hours</option>
                  <option value="1d">1 Day</option>
                  <option value="7d">7 Days</option>
                  <option value="custom">Custom Date & Time</option>
                </select>
              </div>

              {/* Custom Date Picker (Conditional) */}
              {durationType === 'custom' && (
                <div className="animate-in fade-in duration-300">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Pick Expiration Date</label>
                  <input 
                    type="datetime-local"
                    className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-200"
                    value={customDate}
                    onChange={(e) => setCustomDate(e.target.value)}
                  />
                </div>
              )}

              {/* Expiration Preview Text */}
              {isMounted && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield className="w-4 h-4" />
                  <span>{getExpirationPreview()}</span>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">{error}</p>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  "Shorten Link"
                )}
              </button>
            </form>
          ) : (
            /* Success State */
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Link Created!</h2>
              <p className="text-gray-400 mb-6">Your temporary link is ready to share.</p>
              
              <div className="flex items-center gap-2 bg-gray-800/80 border border-gray-700 rounded-xl p-2">
                <input 
                  type="text" 
                  readOnly 
                  value={result} 
                  className="w-full bg-transparent px-3 py-2 text-green-400 font-mono text-sm outline-none truncate"
                />
                <button 
                  onClick={handleCopy}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all ${
                    copied ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <button 
                onClick={() => { setResult(null); setUrl(''); }}
                className="mt-6 text-sm text-gray-500 hover:text-gray-300 underline transition-colors"
              >
                Shorten another link
              </button>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Built for speed. Links self-destruct automatically.
        </p>
      </div>
    </main>
  );
}