'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Player } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Menu, RefreshCw, Flag, Undo, Redo, Eraser, Delete, Check, Minus, PlusCircle, Pencil, MinusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EditPlayersDialog } from './edit-players-dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

type ScoresGrid = (number | null)[][];

export function GameClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const [players, setPlayers] = useState<Player[]>([]);
  const [numRows, setNumRows] = useState(10);
  const [scores, setScores] = useState<ScoresGrid>([]);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [history, setHistory] = useState<ScoresGrid[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isEditPlayersOpen, setIsEditPlayersOpen] = useState(false);
  const [rowsToAdd, setRowsToAdd] = useState(1);
  const [rowsToRemove, setRowsToRemove] = useState(1);

  useEffect(() => {
    document.body.classList.add('game-theme');
    const playerNames = searchParams.getAll('player');
    const rows = searchParams.get('rows');

    if (rows) {
      setNumRows(parseInt(rows, 10));
    } else {
        const savedRows = localStorage.getItem('remi-game-rows');
        if (savedRows) {
            setNumRows(parseInt(savedRows, 10));
        }
    }

    if (playerNames.length > 0) {
      const initialNumRows = rows ? parseInt(rows, 10) : (localStorage.getItem('remi-game-rows') ? parseInt(localStorage.getItem('remi-game-rows')!, 10) : 10);
      setNumRows(initialNumRows);
      setPlayers(playerNames.map(name => ({ name, scores: [], total: 0 })));
      const initialScores: ScoresGrid = Array(initialNumRows)
        .fill(0)
        .map(() => Array(playerNames.length).fill(null));
      setScores(initialScores);
      setHistory([initialScores]);
      setHistoryIndex(0);
    } else {
      router.replace('/new-game');
    }

    return () => {
        document.body.classList.remove('game-theme');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, router]);

  const updateScores = useCallback((newScores: ScoresGrid) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newScores);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setScores(newScores);
  }, [history, historyIndex]);

  const handleConfirm = useCallback(() => {
    if (activeCell) {
      const { row, col } = activeCell;
      const newScores = scores.map(r => [...r]);
      const scoreValue = inputValue === '' || inputValue === '-' ? null : parseInt(inputValue, 10);
      if (!isNaN(scoreValue as any) || scoreValue === null) {
        newScores[row][col] = scoreValue;
        updateScores(newScores);
      }
      setActiveCell(null);
      setInputValue('');
    }
  }, [activeCell, inputValue, scores, updateScores]);
  
  const handleNumpadClick = (value: string) => {
    if (value === '-') {
        if (inputValue === '') {
            setInputValue('-');
        } else if (inputValue.startsWith('-')) {
            setInputValue(inputValue.substring(1));
        } else {
            setInputValue('-' + inputValue);
        }
        return;
    }
    setInputValue(prev => prev + value);
  };


  const handleBackspace = () => {
    setInputValue(prev => prev.slice(0, -1));
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
        if (!activeCell) return;

        if (event.key >= '0' && event.key <= '9') {
            handleNumpadClick(event.key);
        } else if (event.key === '-') {
            handleNumpadClick('-');
        } else if (event.key === 'Enter') {
            event.preventDefault();
            handleConfirm();
        } else if (event.key === 'Backspace') {
            handleBackspace();
        } else if (event.key === 'Escape') {
            setActiveCell(null);
            setInputValue('');
        }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
        document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeCell, handleConfirm]);

  useEffect(() => {
    if (scores.length > 0 && players.length > 0) {
        const updatedPlayers = players.map((player, colIndex) => {
          const newScores = scores.map(row => row[colIndex] ?? 0);
          const total = newScores.reduce((acc, score) => acc + score, 0);
          return { ...player, scores: newScores, total };
        });
        setPlayers(updatedPlayers);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scores]);


  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
    const currentValue = scores[row][col];
    setInputValue(currentValue !== null ? String(currentValue) : '');
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setScores(history[historyIndex - 1]);
    }
  };
  
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setScores(history[historyIndex + 1]);
    }
  };

  const handleNewGame = () => {
    router.push('/new-game');
  };

  const handleEndGame = () => {
    router.push('/');
  }

  const handleAddRows = () => {
    if (rowsToAdd > 0) {
        setNumRows(prev => prev + rowsToAdd);
        const newRows = Array(rowsToAdd).fill(0).map(() => Array(players.length).fill(null));
        const newScores = [...scores, ...newRows];
        updateScores(newScores);
        toast({
            title: 'Rows Added',
            description: `${rowsToAdd} new rows have been added to the scoreboard.`
        })
    }
  }

  const handleRemoveRows = () => {
    if (rowsToRemove > 0 && scores.length > rowsToRemove) {
      setNumRows(prev => prev - rowsToRemove);
      const newScores = scores.slice(0, scores.length - rowsToRemove);
      updateScores(newScores);
      toast({
        title: 'Rows Removed',
        description: `${rowsToRemove} rows have been removed from the bottom.`,
      });
    } else {
       toast({
        title: 'Invalid Action',
        description: 'Cannot remove that many rows.',
        variant: 'destructive'
      });
    }
  };

  const handlePlayerNamesUpdate = (updatedPlayers: Player[]) => {
    setPlayers(updatedPlayers);
    // Optionally, update game state in URL or localStorage
    const params = new URLSearchParams();
    updatedPlayers.forEach(p => params.append('player', p.name));
    params.append('rows', String(numRows));
    router.replace(`/game?${params.toString()}`, { scroll: false });
  };

  const totals = useMemo(() => {
    if (players.length === 0) return [];
    return players.map(p => p.total);
  }, [players]);

  if (players.length === 0) {
    return <div className="bg-green-900 text-white flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const gridColsClass = `grid-cols-${players.length}`;

  return (
    <>
      <EditPlayersDialog
        isOpen={isEditPlayersOpen}
        setIsOpen={setIsEditPlayersOpen}
        players={players}
        onUpdate={handlePlayerNamesUpdate}
      />
      <div className="flex flex-col h-screen bg-background text-foreground font-sans p-2 sm:p-4">
        <header className="flex items-center justify-between pb-2 sm:pb-4">
          <Sheet>
              <SheetTrigger asChild>
                  <Button variant="ghost"><Menu className="mr-2"/>Menu</Button>
              </SheetTrigger>
              <SheetContent side="left">
                  <SheetHeader>
                      <SheetTitle>Game Menu</SheetTitle>
                      <SheetDescription>
                          Manage your game from here.
                      </SheetDescription>
                  </SheetHeader>
                  <div className="grid gap-6 py-4">
                      <Button variant="outline" onClick={() => setIsEditPlayersOpen(true)}>
                        <Pencil className="mr-2"/>Edit Players
                      </Button>
                      <div className="space-y-2">
                        <Label htmlFor="add-rows">Add Score Rows</Label>
                        <div className="flex gap-2">
                            <Input 
                                id="add-rows" 
                                type="number" 
                                value={rowsToAdd} 
                                onChange={(e) => setRowsToAdd(e.target.value ? parseInt(e.target.value, 10) : 0)}
                                min="1"
                                className="w-20"
                            />
                            <Button variant="outline" onClick={handleAddRows}>
                                <PlusCircle className="mr-2"/>Add
                            </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="remove-rows">Remove Score Rows</Label>
                        <div className="flex gap-2">
                          <Input
                            id="remove-rows"
                            type="number"
                            value={rowsToRemove}
                            onChange={(e) => setRowsToRemove(e.target.value ? parseInt(e.target.value, 10) : 0)}
                            min="1"
                            className="w-20"
                          />
                          <Button variant="outline" onClick={handleRemoveRows}>
                            <MinusCircle className="mr-2" />
                            Remove
                          </Button>
                        </div>
                      </div>
                      <hr/>
                      <Button variant="outline" onClick={handleNewGame}><RefreshCw className="mr-2"/>New Game</Button>
                      <Button variant="destructive" onClick={handleEndGame}><Flag className="mr-2"/>End Game</Button>
                  </div>
              </SheetContent>
          </Sheet>
          <h1 className="text-xl sm:text-2xl font-bold">ScoreKeeper</h1>
          <div className="flex gap-2">
              <Button variant="ghost" size="icon" onClick={handleUndo} disabled={historyIndex <= 0}><Undo/></Button>
              <Button variant="ghost" size="icon" onClick={handleRedo} disabled={historyIndex >= history.length - 1}><Redo/></Button>
          </div>
        </header>

        <main className="flex-grow overflow-auto">
          <div className={cn('grid gap-2 text-center', gridColsClass)}>
            {players.map(player => (
              <div key={player.name} className="font-bold text-lg truncate">{player.name}</div>
            ))}
          </div>
          <div className={cn('grid gap-2 text-center mt-2', gridColsClass)}>
              {scores.map((row, rowIndex) => (
                  players.map((_, colIndex) => (
                      <div
                          key={`${rowIndex}-${colIndex}`}
                          className={`p-2 border border-border rounded-md cursor-pointer h-12 flex items-center justify-center text-xl
                          ${activeCell?.row === rowIndex && activeCell?.col === colIndex ? 'bg-primary/50 ring-2 ring-primary' : ''}`}
                          onClick={() => handleCellClick(rowIndex, colIndex)}
                      >
                          {scores[rowIndex]?.[colIndex]}
                      </div>
                  ))
              ))}
          </div>
        </main>

        <footer className="pt-2">
          <div className={cn('grid gap-2 text-center border-t-2 border-border pt-2', gridColsClass)}>
              {totals.map((total, i) => (
                  <div key={i} className="font-bold text-xl p-2 bg-muted/20 rounded-md">{total}</div>
              ))}
          </div>
          
          {activeCell && (
            <div className="fixed bottom-0 left-0 right-0 p-2 bg-card/95 backdrop-blur-sm border-t">
              <div className="max-w-md mx-auto">
                <div className="p-2 text-right text-3xl font-mono h-14 border-b-2 mb-2 flex items-center justify-end">{inputValue || 0}</div>
                <div className="grid grid-cols-4 gap-2">
                  {numpadKeys.map(key => (
                    <Button key={key} onClick={() => handleNumpadClick(key)} variant="secondary" className="h-12 text-xl">{key}</Button>
                  ))}
                  <Button onClick={() => handleNumpadClick('-')} variant="secondary" className="h-12 text-xl"><Minus size={24}/></Button>
                  <Button onClick={() => handleNumpadClick('0')} variant="secondary" className="h-12 text-xl">0</Button>
                  <Button onClick={handleClear} variant="secondary" className="h-12 text-xl"><Eraser size={24}/></Button>
                  <Button onClick={handleBackspace} variant="secondary" className="h-12 text-xl col-span-2"><Delete size={24}/></Button>
                  <Button onClick={handleConfirm} variant="default" className="h-12 text-xl col-span-2"><Check /> Confirm</Button>
                </div>
              </div>
            </div>
          )}
        </footer>
      </div>
    </>
  );
}
