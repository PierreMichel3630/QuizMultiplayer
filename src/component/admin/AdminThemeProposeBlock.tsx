import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { selectThemesProposeAdmin } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { sortByVoteDesc } from "src/utils/sort";

export const AdminThemeProposeBlock = () => {
  const [themes, setThemes] = useState<Array<Theme>>([]);

  const getThemePropose = () => {
    selectThemesProposeAdmin().then(({ data }) => {
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
        <Grid item xs={12} key={theme.id}></Grid>
      ))}
    </Grid>
  );
};
