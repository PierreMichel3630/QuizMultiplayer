import { Avatar, Paper } from "@mui/material";
import { px } from "csx";
import { Game } from "src/models/Game";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

interface Props {
  game: Game;
}

export const GameBlock = ({ game }: Props) => {
  return (
    <Paper sx={{ p: 1, display: "flex", gap: 2, alignItems: "center" }}>
      {game.image && (
        <Avatar
          alt="flag"
          src={game.image}
          sx={{ width: px(70), height: px(70) }}
        />
      )}
      <JsonLanguageBlock variant="h1" sx={{ fontSize: 30 }} value={game.name} />
    </Paper>
  );
};
