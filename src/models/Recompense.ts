import { TypeRecompense } from "./enum/TypeRecompense";

export interface LoginStreakDayRecompense {
  day: number;
  recompenses: Array<LoginStreakRecompense>;
}

export interface LoginStreakRecompense {
  type: TypeRecompense;
  value: number;
}
