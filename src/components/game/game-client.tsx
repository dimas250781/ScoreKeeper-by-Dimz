'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { Player } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Menu, ArrowLeft, RefreshCw, Eraser, Check, Undo, Redo, Flag } from 'lucide-react';

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
      setPlayers(playerNames.map(name => ({ name, scores: [], total: 0 })));
      const initialScores: ScoresGrid = Array(numRows)
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
  }, [searchParams, router, numRows]);

  const updateScores = useCallback((newScores: ScoresGrid) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(newScores);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setScores(newScores);
  }, [history, historyIndex]);

  useEffect(() => {
    const updatedPlayers = players.map((player, colIndex) => {
      const newScores = scores.map(row => row[colIndex] ?? 0);
      const total = newScores.reduce((acc, score) => acc + score, 0);
      return { ...player, scores: newScores, total };
    });
    setPlayers(updatedPlayers);
  }, [scores]);


  const handleCellClick = (row: number, col: number) => {
    setActiveCell({ row, col });
    const currentValue = scores[row][col];
    setInputValue(currentValue !== null ? String(currentValue) : '');
  };

  const handleNumpadClick = (value: string) => {
    setInputValue(prev => prev + value);
  };

  const handleClear = () => {
    setInputValue('');
  };

  const handleConfirm = () => {
    if (activeCell) {
      const { row, col } = activeCell;
      const newScores = scores.map(r => [...r]);
      const scoreValue = inputValue === '' ? null : parseInt(inputValue, 10);
      if (!isNaN(scoreValue as any)) {
        newScores[row][col] = scoreValue;
        updateScores(newScores);
      }
      setActiveCell(null);
      setInputValue('');
    }
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

  const totals = useMemo(() => {
    if (players.length === 0) return [];
    return players.map(p => p.total);
  }, [players]);

  if (players.length === 0) {
    return <div className="bg-green-900 text-white flex justify-center items-center h-screen">Loading...</div>;
  }
  
  const numpadKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];

  return (
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
                <div className="grid gap-4 py-4">
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
        <div className="grid grid-cols-4 gap-2 text-center">
          {players.map(player => (
            <div key={player.name} className="font-bold text-lg truncate">{player.name}</div>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2 text-center mt-2">
            {Array(numRows).fill(0).map((_, rowIndex) => (
                players.map((player, colIndex) => (
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
        <div className="grid grid-cols-4 gap-2 text-center border-t-2 border-border pt-2">
            {totals.map((total, i) => (
                <div key={i} className="font-bold text-xl p-2 bg-muted/20 rounded-md">{total}</div>
            ))}
        </div>
        
        {activeCell && (
          <div className="mt-2 p-2 rounded-lg bg-card/80">
            <div className="p-2 text-right text-2xl font-mono h-12 border-b-2 mb-2">{inputValue || 0}</div>
            <div className="grid grid-cols-5 gap-1">
              {numpadKeys.map(key => (
                <Button key={key} onClick={() => handleNumpadClick(key)} variant="secondary" className="h-12 text-xl">{key}</Button>
              ))}
              <Button onClick={handleClear} variant="destructive" className="h-12 text-xl"><Eraser /></Button>
              <Button onClick={handleConfirm} variant="default" className="h-12 text-xl col-span-4"><Check /> Confirm</Button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
}
