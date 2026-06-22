"use client"

// app/page.tsx
import { Zap } from 'lucide-react';
import { useLinkShortener } from '@/hooks/useLinkShortener';
import LinkForm from '@/components/LinkForm';
import SuccessState from '@/components/SuccessState';
import RecentLinks from '@/components/RecentLinks';

export default function Home() {
  const linkState = useLinkShortener();

  return (
    <main className="relative min-h-screen overflow-hidden bg-gray-950 text-white">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        
        {/* Proper Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="p-2 bg-purple-500/10 rounded-lg border border-purple-500/20">
              <Zap className="w-6 h-6 text-purple-400" />
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-500 bg-clip-text text-transparent">
              QuickLink
            </h1>
          </div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Short links that know when to die. Create self-destructing links, track clicks, and generate QR codes instantly.
          </p>
        </div>

        {/* Main Grid Layout: 2 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          
          {/* Left Column: Create Link Form */}
          <div className="sticky top-24">
            <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-8 shadow-2xl">
              <h2 className="text-2xl font-bold mb-6 text-white">Create Short Link</h2>
              
              {!linkState.result ? (
                <LinkForm {...linkState} />
              ) : (
                <SuccessState 
                  shortUrl={linkState.result} 
                  shortCode={linkState.result.split('/').pop() || ''} 
                  copied={linkState.copied} 
                  handleCopy={linkState.handleCopy} 
                  resetForm={linkState.resetForm} 
                />
              )}
            </div>
          </div>

          {/* Right Column: Recent Links Dashboard */}
          <div className="min-h-[400px]">
            <RecentLinks />
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-20 border-t border-gray-800/50 pt-8">
          <p className="text-gray-600 text-sm">
            Built for speed. Links self-destruct automatically. No manual cleanup needed.
          </p>
        </div>
      </div>
    </main>
  );
}