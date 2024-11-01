import { Score } from "./Score";

export interface Ranking extends Score {
  ranking: number;
  dategame: Date;
}
