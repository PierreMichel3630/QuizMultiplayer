import { TypeRecompense } from "src/models/enum/TypeRecompense";
import { StreakDayRecompense } from "src/models/Recompense";

/* LOGIN STREAK */
export const RECOMPENSES_STREAK: Array<StreakDayRecompense> = [
  { day: 1, recompenses: [{ type: TypeRecompense.GOLD, value: 50 }] },
  { day: 2, recompenses: [{ type: TypeRecompense.XP, value: 200 }] },
  { day: 3, recompenses: [{ type: TypeRecompense.GOLD, value: 100 }] },
  { day: 4, recompenses: [{ type: TypeRecompense.XP, value: 1000 }] },
  { day: 5, recompenses: [{ type: TypeRecompense.GOLD, value: 500 }] },
  { day: 6, recompenses: [{ type: TypeRecompense.XP, value: 2000 }] },
  { day: 7, recompenses: [{ type: TypeRecompense.GOLD, value: 1000 }] },
  { day: 8, recompenses: [{ type: TypeRecompense.XP, value: 5000 }] },
  { day: 9, recompenses: [{ type: TypeRecompense.GOLD, value: 1500 }] },
  {
    day: 10,
    recompenses: [
      { type: TypeRecompense.GOLD, value: 2000 },
      { type: TypeRecompense.XP, value: 2000 },
    ],
  },
];

export const MAX_DAY_RECOMPENSES_STREAK = 10;

/* CHALLENGE */
export const NUMBER_QUESTIONS_CHALLENGE = 10;
