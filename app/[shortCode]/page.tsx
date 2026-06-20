// // app/[shortCode]/page.tsx
// import { PrismaClient } from '@prisma/client';
// import { redirect } from 'next/navigation';
// import Link from 'next/link';
// import { Clock, Home } from 'lucide-react';

// const prisma = new PrismaClient();

// export default async function RedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
//   const { shortCode } = await params;

//   const link = await prisma.link.findUnique({
//     where: { shortCode },
//   });

//   if (!link) {
//     return <ExpiredPage message="This link doesn't exist or has been deleted." />;
//   }

//   if (new Date() > link.expiresAt) {
//     return <ExpiredPage message="This link has expired." />;
//   }

//   redirect(link.originalUrl);
// }

// function ExpiredPage({ message }: { message: string }) {
//   return (
//     <main className="relative flex min-h-screen items-center justify-center p-4 bg-gray-950 overflow-hidden">
//       <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

//       <div className="relative z-10 text-center max-w-md mx-auto">
//         <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
//           <Clock className="w-10 h-10 text-red-400" />
//         </div>
//         <h1 className="text-3xl font-bold text-white mb-3">Time's Up!</h1>
//         <p className="text-gray-400 mb-8 text-lg">{message}</p>
//         <Link 
//           href="/"
//           className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors border border-gray-700"
//         >
//           <Home className="w-5 h-5" />
//           Go to QuickLink
//         </Link>
//       </div>
//     </main>
//   );
// }


// app/[shortCode]/page.tsx
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Clock, Home, Ban } from 'lucide-react';

const prisma = new PrismaClient();

export default async function RedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = await params;

  const link = await prisma.link.findUnique({
    where: { shortCode },
  });

  if (!link) {
    return <ExpiredPage message="This link doesn't exist." icon="not_found" />;
  }

  if (new Date() > link.expiresAt) {
    return <ExpiredPage message="This link has expired." icon="time" />;
  }

  // ----------------- নতুন Link Drip লজিক -----------------
  if (link.maxClicks !== null && link.maxClicks <= 0) {
    return <ExpiredPage message="This single-use link has already been accessed." icon="drip" />;
  }

  // যদি লিংকে ক্লিক লিমিট থাকে, তাহলে ডাটাবেসে ১ কমিয়ে দাও
  if (link.maxClicks !== null) {
    await prisma.link.update({
      where: { shortCode },
      data: { maxClicks: { decrement: 1 } }, // ১ কমিয়ে দিচ্ছে
    });
  }
  // ------------------------------------------------

  redirect(link.originalUrl);
}

// ExpiredPage কম্পোনেন্টটি আইকন অনুযায়ী মেসেজ দেখানোর জন্য আপডেট করা হলো
function ExpiredPage({ message, icon }: { message: string, icon: string }) {
  const IconComponent = icon === 'drip' ? Ban : Clock;
  
  return (
    <main className="relative flex min-h-screen items-center justify-center p-4 bg-gray-950 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-md mx-auto">
        <div className="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <IconComponent className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Access Denied</h1>
        <p className="text-gray-400 mb-8 text-lg">{message}</p>
        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl transition-colors border border-gray-700"
        >
          <Home className="w-5 h-5" />
          Go to QuickLink
        </Link>
      </div>
    </main>
  );
}