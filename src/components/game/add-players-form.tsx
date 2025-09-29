'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle, MinusCircle, User, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddPlayersFormProps {
    numRows: number;
}

export function AddPlayersForm({ numRows }: AddPlayersFormProps) {
  const [players, setPlayers] = useState<string[]>(['Player 1', 'Player 2']);
  const router = useRouter();
  const { toast } = useToast();

  const handleAddPlayer = () => {
    if (players.length < 6) {
      setPlayers([...players, `Player ${players.length + 1}`]);
    } else {
      toast({
        title: 'Maximum players reached',
        description: 'You can add a maximum of 6 players.',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (players.length > 2) {
      const newPlayers = [...players];
      newPlayers.splice(index, 1);
      setPlayers(newPlayers);
    } else {
      toast({
        title: 'Minimum players required',
        description: 'You need at least 2 players to start a game.',
        variant: 'destructive',
      });
    }
  };

  const handlePlayerNameChange = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validPlayers = players.map(p => p.trim()).filter(p => p !== '');
    if (validPlayers.length < 2) {
      toast({
        title: 'Not enough players',
        description: 'Please enter names for at least 2 players.',
        variant: 'destructive',
      });
      return;
    }
    
    if (new Set(validPlayers).size !== validPlayers.length) {
      toast({
        title: 'Duplicate names',
        description: 'Player names must be unique.',
        variant: 'destructive',
      });
      return;
    }

    const params = new URLSearchParams();
    validPlayers.forEach(player => params.append('player', player));
    params.append('rows', String(numRows));
    router.push(`/game?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {players.map((player, index) => (
          <div key={index} className="flex items-center gap-2">
            <Label htmlFor={`player-${index}`} className="sr-only">
              Player {index + 1}
            </Label>
            <div className="relative flex-grow">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id={`player-${index}`}
                placeholder={`Player ${index + 1} Name`}
                value={player}
                onChange={e => handlePlayerNameChange(index, e.target.value)}
                required
                className="pl-9"
              />
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemovePlayer(index)}
              disabled={players.length <= 2}
              aria-label="Remove player"
            >
              <MinusCircle className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleAddPlayer}
          disabled={players.length >= 6}
          className="w-full"
        >
          <PlusCircle />
          Add Player
        </Button>
        <Button type="submit" className="w-full">
          <Play />
          Start Game
        </Button>
      </div>
    </form>
  );
}
