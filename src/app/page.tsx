import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { History, HelpCircle, PlusCircle } from 'lucide-react';
import { Logo } from '@/components/common/logo';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="items-center text-center">
            <Logo className="w-20 h-20 mb-4" />
            <CardTitle className="text-3xl font-headline tracking-tight">RemiScore</CardTitle>
            <CardDescription className="text-lg">Your companion for tracking Remi scores.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button asChild size="lg" className="w-full">
              <Link href="/new-game">
                <PlusCircle />
                Start New Game
              </Link>
            </Button>
            <Button asChild variant="secondary" className="w-full">
              <Link href="/history">
                <History />
                Game History
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/rules">
                <HelpCircle />
                Rule Helper
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
