export interface Elo {
  eloPlayer1: number;
  eloPlayer2: number;
  deltaPlayer1: Delta;
  deltaPlayer2: Delta;
}

interface Delta {
  win: number;
  draw: number;
  lose: number;
}
