// app/page.tsx
'use client';

import { useState } from 'react';
import { addHours, addDays, format } from 'date-fns';

export default function Home() {
  const [url, setUrl] = useState('');
  const [durationType, setDurationType] = useState('1d');
  const [customDate, setCustomDate] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResult(null);

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

  // Calculate preview expiration text
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
    return `Expires on: ${format(date, 'PPp')}`;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Link Shortener</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Long URL</label>
            <input 
              type="url" 
              required
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lifespan</label>
            <select 
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              value={durationType}
              onChange={(e) => setDurationType(e.target.value)}
            >
              <option value="1h">1 Hour</option>
              <option value="5h">5 Hours</option>
              <option value="1d">1 Day</option>
              <option value="7d">7 Days</option>
              <option value="custom">Custom Date</option>
            </select>
          </div>

          {durationType === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expiration Date</label>
              <input 
                type="datetime-local"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
              />
            </div>
          )}

          <p className="text-xs text-gray-500 italic">{getExpirationPreview()}</p>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Shortening...' : 'Shorten URL'}
          </button>
        </form>

        {error && <p className="mt-4 text-red-500 text-center text-sm">{error}</p>}

        {result && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-800 font-medium mb-2">Your Short Link:</p>
            <div className="flex items-center gap-2">
              <input 
                type="text" 
                readOnly 
                value={result} 
                className="w-full bg-white border border-green-300 rounded px-2 py-1 text-green-900"
              />
              <button 
                onClick={() => navigator.clipboard.writeText(result)}
                className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
              >
                Copy
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}