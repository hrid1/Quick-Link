'use client'

// hooks/useLinkShortener.ts
import { useState, useEffect } from 'react';
import { addHours, addDays, format } from 'date-fns';

export const useLinkShortener = () => {
  const [url, setUrl] = useState('');
  const [durationType, setDurationType] = useState('1d');
  const [customDate, setCustomDate] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [isLinkDrip, setIsLinkDrip] = useState(false);
  
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
        body: JSON.stringify({ url, durationType, customDate, customAlias, isLinkDrip }),
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

  const resetForm = () => {
    setResult(null);
    setUrl('');
    setCustomAlias('');
    setIsLinkDrip(false);
  };

  return {
    url, setUrl,
    durationType, setDurationType,
    customDate, setCustomDate,
    customAlias, setCustomAlias,
    isLinkDrip, setIsLinkDrip,
    result, loading, error, copied, isMounted,
    getExpirationPreview, handleSubmit, handleCopy, resetForm
  };
};