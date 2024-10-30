import { Colors } from "src/style/Colors";

export enum Difficulty {
  FACILE = "FACILE",
  MOYEN = "MOYEN",
  DIFFICILE = "DIFFICILE",
  IMPOSSIBLE = "IMPOSSIBLE",
}

export const colorDifficulty: { [key: string]: string } = {
  FACILE: Colors.green,
  MOYEN: Colors.orange,
  DIFFICILE: Colors.red,
  IMPOSSIBLE: Colors.black,
};

export enum StatusGameSolo {
  END = "END",
  START = "START",
}

export enum StatusGameDuel {
  WAIT = "WAIT",
  END = "END",
  START = "START",
  CANCEL = "CANCEL",
}
