'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, MinusCircle, User } from 'lucide-react';

interface EditPlayersDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  players: Player[];
  onUpdate: (players: Player[]) => void;
}

export function EditPlayersDialog({ isOpen, setIsOpen, players, onUpdate }: EditPlayersDialogProps) {
  const [editedNames, setEditedNames] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      setEditedNames(players.map(p => p.name));
    }
  }, [isOpen, players]);

  const handleNameChange = (index: number, newName: string) => {
    const newNames = [...editedNames];
    newNames[index] = newName;
    setEditedNames(newNames);
  };
  
  const handleAddPlayer = () => {
    if (editedNames.length < 6) {
      setEditedNames([...editedNames, `Player ${editedNames.length + 1}`]);
    } else {
      toast({
        title: 'Maximum players reached',
        description: 'You can add a maximum of 6 players.',
        variant: 'destructive',
      });
    }
  };

  const handleRemovePlayer = (index: number) => {
    if (editedNames.length > 2) {
      const newNames = [...editedNames];
      newNames.splice(index, 1);
      setEditedNames(newNames);
    } else {
      toast({
        title: 'Minimum players required',
        description: 'You need at least 2 players.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = () => {
    const trimmedNames = editedNames.map(name => name.trim());
    
    if (trimmedNames.some(name => name === '')) {
        toast({ title: "Invalid Name", description: "Player names cannot be empty.", variant: "destructive" });
        return;
    }

    if (new Set(trimmedNames).size !== trimmedNames.length) {
        toast({ title: "Duplicate Names", description: "Player names must be unique.", variant: "destructive" });
        return;
    }

    // Create new player objects, preserving old scores if they existed
    const updatedPlayers = trimmedNames.map((name, index) => {
      const oldPlayer = players.find(p => p.name === name); // Not perfect if names change
      const existingPlayer = players[index];
      
      if (existingPlayer && existingPlayer.name === name) {
        return existingPlayer; // No change
      }
      
      // If we are adding a new player, or name is new
      return {
        name: name,
        scores: existingPlayer?.scores || [], // keep scores if player existed at index
        total: existingPlayer?.total || 0,
      };
    });

    onUpdate(updatedPlayers);
    setIsOpen(false);
    toast({ title: "Players Updated", description: "The player list has been successfully updated." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Edit Players</DialogTitle>
          <DialogDescription>
            You can add, remove, and rename players below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 flex-grow overflow-y-auto pr-2">
          {editedNames.map((name, index) => (
            <div key={index} className="flex items-center gap-2">
                <Label htmlFor={`name-${index}`} className="sr-only">
                    Player {index + 1}
                </Label>
                <div className="relative flex-grow">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id={`name-${index}`}
                    value={name}
                    onChange={(e) => handleNameChange(index, e.target.value)}
                    className="pl-9"
                    placeholder={`Player ${index + 1}`}
                  />
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemovePlayer(index)}
                    disabled={editedNames.length <= 2}
                    aria-label="Remove player"
                >
                    <MinusCircle className="h-5 w-5" />
                </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={handleAddPlayer}
            disabled={editedNames.length >= 6}
            className="w-full mt-2"
            >
            <PlusCircle className="mr-2"/>
            Add Player
          </Button>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
