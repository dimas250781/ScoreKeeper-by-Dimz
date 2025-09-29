'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Scoreboard } from '@/components/game/scoreboard';
import type { Player, Game } from '@/lib/types';
import { ScoreInputDialog } from '@/components/game/score-input-dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { ArrowLeft, Plus, Crown, Flag } from 'lucide-react';

export function GameClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [players, setPlayers] = useState<Player[]>([]);
  const [round, setRound] = useState(1);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const playerNames = searchParams.getAll('player');
    if (playerNames.length >= 2) {
      setPlayers(
        playerNames.map(name => ({
          name,
          scores: [],
          total: 0,
        }))
      );
    } else {
      // Redirect if no players are found, maybe they refreshed the page
      router.replace('/new-game');
    }
  }, [searchParams, router]);

  const handleAddRoundScores = (scores: (number | null)[]) => {
    if (scores.some(score => score === null)) {
       toast({
        title: 'Incomplete scores',
        description: 'Please enter a score for every player.',
        variant: 'destructive',
      });
      return false;
    }

    setPlayers(currentPlayers =>
      currentPlayers.map((player, index) => {
        const newScores = [...player.scores, scores[index]!];
        return {
          ...player,
          scores: newScores,
          total: newScores.reduce((a, b) => a + b, 0),
        };
      })
    );
    setRound(r => r + 1);
    toast({
        title: `Round ${round} Scores Added!`,
        description: 'The scoreboard has been updated.',
    });
    return true;
  };
  
  const handleEndGame = () => {
    const winner = players.reduce((prev, current) => (prev.total < current.total ? prev : current));

    const finishedGame: Game = {
      id: new Date().toISOString(),
      players,
      createdAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      winner: winner.name,
    };

    const history: Game[] = JSON.parse(localStorage.getItem('remiScoreHistory') || '[]');
    history.unshift(finishedGame);
    localStorage.setItem('remiScoreHistory', JSON.stringify(history));

    toast({
      title: 'Game Over!',
      description: `${winner.name} is the winner!`,
    });
    router.push('/history');
  };

  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => a.total - b.total);
  }, [players]);

  if (!isClient || players.length === 0) {
    return null; // or a loading skeleton
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-3xl font-headline flex items-center gap-2">
            <Button variant="ghost" size="icon" className="mr-2 h-8 w-8" asChild>
                <Link href="/"><ArrowLeft/></Link>
            </Button>
            Round {round}
          </CardTitle>
          <CardDescription>Live scoreboard</CardDescription>
        </div>
        <div className="flex items-center gap-2">
            <Crown className="w-8 h-8 text-amber-500" />
            <div className="text-right">
                <p className="font-bold text-lg">{sortedPlayers[0]?.name || '...'}</p>
                <p className="text-sm text-muted-foreground">Leading with {sortedPlayers[0]?.total || 0}</p>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <Scoreboard players={sortedPlayers} />
      </CardContent>
      <CardFooter className="flex flex-col sm:flex-row gap-2">
        <ScoreInputDialog players={players} onAddScores={handleAddRoundScores}>
            <Button className="w-full sm:w-auto flex-grow">
                <Plus className="mr-2 h-4 w-4"/>
                Add Round Scores
            </Button>
        </ScoreInputDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="w-full sm:w-auto">
                <Flag className="mr-2 h-4 w-4" />
                End Game
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to end the game?</AlertDialogTitle>
              <AlertDialogDescription>
                This will finalize the scores, save the game to your history, and declare a winner.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleEndGame}>End Game</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </CardFooter>
    </Card>
  );
}
