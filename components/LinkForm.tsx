// components/LinkForm.tsx
// import { Link2, Shield, BarChart3 } from "lucide-react";
import { Link2, Shield, BarChart3, ClipboardList, Timer, Zap } from 'lucide-react';

interface LinkFormProps {
  url: string;
  setUrl: (val: string) => void;
  durationType: string;
  setDurationType: (val: string) => void;
  customDate: string;
  setCustomDate: (val: string) => void;
  customAlias: string;
  setCustomAlias: (val: string) => void;
  isLinkDrip: boolean;
  setIsLinkDrip: (val: boolean) => void;
  isMounted: boolean;
  getExpirationPreview: () => string;
  error: string;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function LinkForm({
  url,
  setUrl,
  durationType,
  setDurationType,
  customDate,
  setCustomDate,
  customAlias,
  setCustomAlias,
  isLinkDrip,
  setIsLinkDrip,
  isMounted,
  getExpirationPreview,
  error,
  loading,
  handleSubmit,
}: LinkFormProps) {
  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Paste your long URL
          </label>
          <div className="relative">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="url"
              required
              placeholder="https://example.com/very-long-url..."
              className="w-full pl-12 pr-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-gray-200 placeholder-gray-500"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lifespan
            </label>
            <select
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-200 appearance-none"
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
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Custom Alias <span className="text-gray-600">(Optional)</span>
            </label>
            <input
              type="text"
              placeholder="my-portfolio"
              className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-200 placeholder-gray-500"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
            />
          </div>
        </div>

        {durationType === "custom" && (
          <input
            type="datetime-local"
            className="w-full px-4 py-3.5 bg-gray-800/50 border border-gray-700 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-200"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
          />
        )}

        <div className="flex items-center justify-between bg-gray-800/30 border border-gray-700/50 rounded-xl p-4">
          <div>
            <p className="text-sm font-medium text-gray-200 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-purple-400" /> Link Drip
              (Single-Use)
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Link will destroy after 1 click.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setIsLinkDrip(!isLinkDrip)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 ${isLinkDrip ? "bg-purple-600" : "bg-gray-600"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isLinkDrip ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>

        {isMounted && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Shield className="w-4 h-4" />
            <span>{getExpirationPreview()}</span>
          </div>
        )}

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
        >
          {loading ? "Generating..." : "Shorten Link"}
        </button>
      </form>



          <div className="mt-8 pt-6 border-t border-gray-800/50">
      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 text-center">How it works</h4>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="space-y-2">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
            <ClipboardList className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400">Paste long URL</p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
            <Timer className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400">Set expiry time</p>
        </div>
        <div className="space-y-2">
          <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center mx-auto">
            <Zap className="w-4 h-4 text-gray-400" />
          </div>
          <p className="text-xs text-gray-400">Share & track</p>
        </div>
      </div>
    </div>
    </>
  );
}
