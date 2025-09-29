import { AddPlayersForm } from '@/components/game/add-players-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NewGamePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md relative">
        <Button asChild variant="ghost" size="icon" className="absolute -top-14 left-0">
          <Link href="/">
            <ArrowLeft />
            <span className="sr-only">Back to home</span>
          </Link>
        </Button>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline">Setup New Game</CardTitle>
            <CardDescription>Add 2 to 6 players to start.</CardDescription>
          </CardHeader>
          <CardContent>
            <AddPlayersForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
