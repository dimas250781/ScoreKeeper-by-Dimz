import { Suspense } from 'react';
import { GameClient } from '@/components/game/game-client';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function GameLoading() {
  return (
    <main className="p-4 md:p-6">
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
          <div className="flex gap-4">
             <Skeleton className="h-10 flex-1" />
             <Skeleton className="h-10 flex-1" />
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default function GamePage() {
  return (
    <div className="min-h-screen container mx-auto max-w-4xl py-4 md:py-8">
      <Suspense fallback={<GameLoading />}>
        <GameClient />
      </Suspense>
    </div>
  );
}
