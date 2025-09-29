export interface Player {
  name: string;
  scores: number[];
  total: number;
}

export interface Game {
  id: string;
  players: Player[];
  createdAt: string;
  completedAt: string;
  winner: string;
}
