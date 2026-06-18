// app/[shortCode]/page.tsx
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const prisma = new PrismaClient();

// Note: params is now a Promise, so we need to use 'await' in the function signature
export default async function RedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
  // Await the params to get the actual data
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return <ExpiredPage message="Link not found." />;
  }

  if (new Date() > link.expiresAt) {
    return <ExpiredPage message="This link has expired." />;
  }

  redirect(link.originalUrl);
}

function ExpiredPage({ message }: { message: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="rounded-lg bg-white p-8 shadow-lg text-center">
        <h1 className="mb-4 text-2xl font-bold text-gray-800">Oops!</h1>
        <p className="mb-6 text-gray-600">{message}</p>
        <Link 
          href="/"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition-colors"
        >
          Create a new link
        </Link>
      </div>
    </div>
  );
}