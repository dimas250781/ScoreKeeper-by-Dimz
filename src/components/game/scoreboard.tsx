import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Award, Medal, Trophy } from 'lucide-react';
import type { Player } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface ScoreboardProps {
  players: Player[];
}

const rankIcons = [
    <Trophy key="1" className="h-5 w-5 text-yellow-500" />,
    <Medal key="2" className="h-5 w-5 text-gray-400" />,
    <Award key="3" className="h-5 w-5 text-yellow-700" />,
];

export function Scoreboard({ players }: ScoreboardProps) {
  return (
    <div className="rounded-lg border">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[50px] text-center">Rank</TableHead>
                    <TableHead>Player</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead className="text-right hidden sm:table-cell">Rounds</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {players.map((player, index) => (
                    <TableRow key={player.name} className={cn(index === 0 && 'bg-accent/20')}>
                        <TableCell className="font-medium text-center">
                            <div className="flex justify-center items-center h-full">
                                {index < 3 ? rankIcons[index] : <span className="text-muted-foreground">{index + 1}</span>}
                            </div>
                        </TableCell>
                        <TableCell className="font-bold text-base">{player.name}</TableCell>
                        <TableCell className="text-right font-mono text-lg font-bold text-primary">{player.total}</TableCell>
                        <TableCell className="text-right text-muted-foreground hidden sm:table-cell">
                            <div className="flex gap-1 justify-end">
                                {player.scores.map((s, i) => <Badge key={i} variant="secondary">{s}</Badge>)}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>
  );
}
