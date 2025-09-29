'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Player } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

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

    const updatedPlayers = players.map((player, index) => ({
      ...player,
      name: trimmedNames[index],
    }));

    onUpdate(updatedPlayers);
    setIsOpen(false);
    toast({ title: "Players Updated", description: "Player names have been successfully updated." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Player Names</DialogTitle>
          <DialogDescription>
            You can change the names of the players below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {editedNames.map((name, index) => (
            <div key={index} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`name-${index}`} className="text-right">
                Player {index + 1}
              </Label>
              <Input
                id={`name-${index}`}
                value={name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                className="col-span-3"
              />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
