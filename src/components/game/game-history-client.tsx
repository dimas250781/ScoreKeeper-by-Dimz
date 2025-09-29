'use client';

import { useState, useEffect } from 'react';
import type { Game } from '@/lib/types';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Calendar, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

export function GameHistoryClient() {
  const [games, setGames] = useState<Game[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsClient(true);
    const storedGames = localStorage.getItem('remiScoreHistory');
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    }
  }, []);

  const handleClearHistory = () => {
    localStorage.removeItem('remiScoreHistory');
    setGames([]);
    toast({
        title: "History Cleared",
        description: "All saved games have been deleted."
    })
  }

  if (!isClient) {
    return <p>Loading history...</p>;
  }

  if (games.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>No Games Yet</CardTitle>
          <CardDescription>Your completed games will appear here.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div>
        <div className="flex justify-end mb-4">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        Clear History
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete all your saved game history.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleClearHistory}>Yes, delete it all</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        <Accordion type="single" collapsible className="w-full">
        {games.map(game => (
            <AccordionItem value={game.id} key={game.id}>
            <AccordionTrigger>
                <div className="flex justify-between w-full pr-4 items-center">
                    <div className='text-left'>
                        <p className="font-bold flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-amber-500"/> Winner: {game.winner}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                           <Calendar className="w-4 h-4"/> {format(new Date(game.createdAt), 'PPp')}
                        </p>
                    </div>
                    <p className="text-sm font-semibold">{game.players.length} Players</p>
                </div>
            </AccordionTrigger>
            <AccordionContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Player</TableHead>
                            <TableHead className='text-right'>Final Score</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {game.players.sort((a, b) => a.total - b.total).map(player => (
                            <TableRow key={player.name}>
                                <TableCell className="font-medium">{player.name} {player.name === game.winner && '🏆'}</TableCell>
                                <TableCell className="text-right font-mono">{player.total}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </AccordionContent>
            </AccordionItem>
        ))}
        </Accordion>
    </div>
  );
}
