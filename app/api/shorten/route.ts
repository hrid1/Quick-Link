// app/api/shorten/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Standard Prisma 6 import
import { addHours, addDays, parseISO } from 'date-fns';

// Standard Prisma 6 initialization
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { url, durationType, customDate, customAlias, isLinkDrip } = body;

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  let expiresAt: Date;
  const now = new Date();

  // Logic to determine expiration based on selection
  switch (durationType) {
    case '1h':
      expiresAt = addHours(now, 1);
      break;
    case '5h':
      expiresAt = addHours(now, 5);
      break;
    case '1d':
      expiresAt = addDays(now, 1);
      break;
    case '7d':
      expiresAt = addDays(now, 7);
      break;
    case 'custom':
      if (!customDate) return NextResponse.json({ error: 'Custom date required' }, { status: 400 });
      expiresAt = parseISO(customDate);
      break;
    default:
      expiresAt = addDays(now, 1); // Default 1 day
  }

  let finalShortCode: string;

  if (customAlias && customAlias.trim() !== '') {
    // কাস্টম এলিয়াস থাকলে সেটাই ব্যবহার হবে
    finalShortCode = customAlias.trim().toLowerCase();
    
    // চেক করা হচ্ছে এলিয়াসে শুধু মাত্র আলফানিউমেরিক ক্যারেক্টার আছে কিনা (যেমন: my-portfolio-123)
    if (!/^[a-z0-9_-]+$/.test(finalShortCode)) {
      return NextResponse.json({ error: 'Alias can only contain lowercase letters, numbers, hyphens, and underscores.' }, { status: 400 });
    }

    // চেক করা হচ্ছে এই নামটা আগে থেকে ডাটাবেসে আছে কিনা
    const existingLink = await prisma.link.findUnique({
      where: { shortCode: finalShortCode },
    });

    if (existingLink) {
      return NextResponse.json({ error: 'This alias is already taken. Try another one.' }, { status: 409 }); // 409 = Conflict
    }
  } else {
    // কাস্টম এলিয়াস না দিলে র‍্যান্ডম কোড জেনারেট হবে
    finalShortCode = Math.random().toString(36).substring(2, 8);
  }

  try {
    const link = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode: finalShortCode, // <--- এখানে finalShortCode ব্যবহার করা হয়েছে
        alias: customAlias || null, // <--- ডাটাবেসে আলাদাভাবে সেভ করার জন্য
        maxClicks: isLinkDrip ? 1 : null, 
        expiresAt,
      },
    });

    // Note: If your port is 3001, use that in the link or use env variable
    
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    return NextResponse.json({ 
      shortUrl: `${baseUrl}/${link.shortCode}` 
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating link' }, { status: 500 });
  }
}