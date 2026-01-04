import { TypeRecompense } from "./enum/TypeRecompense";

export interface StreakDayRecompense {
  day: number;
  recompenses: Array<StreakRecompense>;
}

export interface StreakRecompense {
  type: TypeRecompense;
  value: number;
}
