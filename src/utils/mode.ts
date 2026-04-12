//import typingsvg from "src/assets/mode/games/typing.svg";
import aimtrainer from "src/assets/mode/games/aimtrainer.svg";
import numbermemory from "src/assets/mode/games/numbermemory.svg";
import reactiontime from "src/assets/mode/games/reactiontime.svg";
//import verbalmemory from "src/assets/mode/games/verbalmemory.svg";
import visualmemory from "src/assets/mode/games/visualmemory.svg";
import { SearchType } from "src/models/enum/TypeCardEnum";

export enum GameModeType {
  BRAIN = "BRAIN",
}

export const GAMES_MODE = [
  //BRAIN
  {
    id: "reactiontime",
    type: SearchType.GAME,
    subtype: GameModeType.BRAIN,
    image: reactiontime,
    translationKey: "reactiontime",
    created_at: new Date(2026, 3, 12),
  },
  {
    id: "sequencememory",
    type: SearchType.GAME,
    subtype: GameModeType.BRAIN,
    image: visualmemory,
    translationKey: "sequencememory",
    created_at: new Date(2026, 3, 12),
  },
  {
    id: "aimtrainer",
    type: SearchType.GAME,
    subtype: GameModeType.BRAIN,
    image: aimtrainer,
    translationKey: "aimtrainer",
    created_at: new Date(2026, 3, 12),
  },
  {
    id: "numbermemory",
    type: SearchType.GAME,
    subtype: GameModeType.BRAIN,
    image: numbermemory,
    translationKey: "numbermemory",
    created_at: new Date(2026, 3, 12),
  },
  //{ id: 0, identifier: "verbalmemory", type: SearchType.GAME, subtype: GameModeType.BRAIN, image: verbalmemory, translationKey: "verbalmemory", created_at: new Date(2026,3,18) },
  //{ id: 0, identifier: "chimptest", type: SearchType.GAME, subtype: GameModeType.BRAIN, image: visualmemory, translationKey: "chimptest", created_at: new Date(2026,3,18) },
  //{ id: 0, identifier: "visualmemory", type: SearchType.GAME, subtype: GameModeType.BRAIN, image: visualmemory, translationKey: "visualmemory", created_at: new Date(2026,3,18) },
  //{ id: 0, identifier: "typing", type: SearchType.GAME, subtype: GameModeType.BRAIN, image: typingsvg, translationKey: "typing", created_at: new Date(2026,3,18) },
];
