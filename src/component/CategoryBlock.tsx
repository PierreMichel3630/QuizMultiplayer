import { Divider, Grid } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { Category } from "src/models/Category";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CardTheme } from "./card/CardTheme";

interface Props {
  category: Category;
}
export const CategoryBlock = ({ category }: Props) => {
  const { themes } = useApp();

  const themesCategory = useMemo(
    () => themes.filter((el) => el.category.id === category.id),
    [category, themes]
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <JsonLanguageBlock variant="h2" sx={{ ml: 2 }} value={category.name} />
      </Grid>
      {themesCategory.map((theme) => (
        <Grid item xs={3} sm={2} md={2} lg={1} key={theme.id}>
          <CardTheme theme={theme} />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
