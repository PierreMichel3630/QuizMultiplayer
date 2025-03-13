import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { selectThemesPropose } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { sortByVoteDesc } from "src/utils/sort";
import { CardAdminTheme } from "../card/CardTheme";

export const AdminThemeProposeBlock = () => {
  const [themes, setThemes] = useState<Array<Theme>>([]);

  const getThemePropose = () => {
    selectThemesPropose().then(({ data }) => {
      const res = data ?? [];
      setThemes([...res].sort(sortByVoteDesc));
    });
  };

  useEffect(() => {
    getThemePropose();
  }, []);

  return (
    <Grid container spacing={1}>
      {themes.map((theme) => (
        <Grid item xs={12} key={theme.id}>
          <CardAdminTheme
            theme={theme}
            onChange={() => {
              getThemePropose();
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
};
