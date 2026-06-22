// app/api/links/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // সর্বশেষ ১০টি লিংক নেওয়া হচ্ছে, নতুন থেকে পুরনো সিরিয়ালে
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // স্ট্যাটস ক্যালকুলেশন
    const totalLinks = links.length;
    const now = new Date();
    const activeLinks = links.filter(l => new Date(l.expiresAt) > now).length;
    const expiredLinks = totalLinks - activeLinks;

    return NextResponse.json({
      stats: { total: totalLinks, active: activeLinks, expired: expiredLinks },
      links
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 });
  }
}