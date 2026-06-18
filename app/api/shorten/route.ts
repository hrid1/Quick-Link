// app/api/shorten/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client'; // Standard Prisma 6 import
import { addHours, addDays, parseISO } from 'date-fns';

// Standard Prisma 6 initialization
const prisma = new PrismaClient();

export async function POST(req: Request) {
  const body = await req.json();
  const { url, durationType, customDate } = body;

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

  // Generate a random short code (6 characters)
  const shortCode = Math.random().toString(36).substring(2, 8);

  try {
    const link = await prisma.link.create({
      data: {
        originalUrl: url,
        shortCode,
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