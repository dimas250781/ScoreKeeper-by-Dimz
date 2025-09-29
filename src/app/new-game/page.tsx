'use client';

import { AddPlayersForm } from '@/components/game/add-players-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function NewGamePage() {
    const [rows, setRows] = useState(10);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        const savedRows = localStorage.getItem('remi-game-rows');
        if (savedRows) {
            setRows(parseInt(savedRows, 10));
        }
    }, []);

    const handleRowsChange = (value: number[]) => {
        setRows(value[0]);
        localStorage.setItem('remi-game-rows', value[0].toString());
    }

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
            <CardDescription>Add players and set game options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <AddPlayersForm numRows={rows} />
             {isClient && (
                 <div className="space-y-4 pt-4 border-t">
                    <div className="flex justify-between items-center">
                        <Label htmlFor="rows" className="text-base font-medium">Number of Rows</Label>
                        <span className="font-mono text-lg w-12 text-center">{rows}</span>
                    </div>
                    <Slider
                        id="rows"
                        min={5}
                        max={20}
                        step={1}
                        value={[rows]}
                        onValueChange={handleRowsChange}
                    />
                </div>
             )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
