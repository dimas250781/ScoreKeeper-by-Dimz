import { Suspense } from 'react';
import { GameClient } from '@/components/game/game-client';
import { Skeleton } from '@/components/ui/skeleton';

function GameLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-900 text-white p-4">
      <Skeleton className="h-8 w-48 mb-4" />
      <div className="w-full max-w-md space-y-2">
        <div className="grid grid-cols-4 gap-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
        {[...Array(5)].map((_, i) => (
            <div key={i} className="grid grid-cols-4 gap-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
        ))}
         <div className="grid grid-cols-4 gap-4 pt-2 border-t-2 border-gray-400">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
      </div>
    </div>
  )
}

export default function GamePage() {
  return (
    <Suspense fallback={<GameLoading />}>
      <GameClient />
    </Suspense>
  );
}
