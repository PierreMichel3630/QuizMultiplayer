import { Avatar, Paper } from "@mui/material";
import { Theme } from "src/models/Theme";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { px } from "csx";

interface Props {
  theme: Theme;
}

export const ThemeBlock = ({ theme }: Props) => {
  return (
    <Paper sx={{ p: 1, display: "flex", gap: 2, alignItems: "center" }}>
      {theme.image && (
        <Avatar
          alt="flag"
          src={theme.image}
          sx={{ width: px(70), height: px(70) }}
        />
      )}
      <JsonLanguageBlock
        variant="h1"
        sx={{ fontSize: 30 }}
        value={theme.name}
      />
    </Paper>
  );
};
