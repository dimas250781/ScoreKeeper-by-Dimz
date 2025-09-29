'use client';

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Player } from '@/lib/types';
import { CheckCircle } from 'lucide-react';

interface ScoreInputDialogProps {
  players: Player[];
  onAddScores: (scores: (number | null)[]) => boolean;
  children: ReactNode;
}

export function ScoreInputDialog({ players, onAddScores, children }: ScoreInputDialogProps) {
  const [open, setOpen] = useState(false);
  const [scores, setScores] = useState<(number | null)[]>([]);

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setScores(new Array(players.length).fill(null));
    }
    setOpen(isOpen);
  };
  
  const handleScoreChange = (index: number, value: string) => {
    const newScores = [...scores];
    const parsedValue = parseInt(value, 10);
    newScores[index] = isNaN(parsedValue) ? null : parsedValue;
    setScores(newScores);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const success = onAddScores(scores);
      if (success) {
          setOpen(false);
      }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Enter Round Scores</DialogTitle>
            <DialogDescription>Input the score for each player for this round.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {players.map((player, index) => (
              <div key={player.name} className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor={`score-${index}`} className="text-right">
                  {player.name}
                </Label>
                <Input
                  id={`score-${index}`}
                  type="number"
                  required
                  value={scores[index] === null ? '' : scores[index]}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  className="col-span-3"
                />
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="submit">
                <CheckCircle className="mr-2 h-4 w-4" />
                Submit Scores
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
