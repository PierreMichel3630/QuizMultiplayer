import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { CategoryWithThemes } from "src/models/Category";
import { sortByName } from "src/utils/sort";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CardTheme } from "./card/CardTheme";

interface Props {
  category: CategoryWithThemes;
}
export const CategoryBlock = ({ category }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useUser();

  const themes = useMemo(() => category.themes, [category]);

  const themesCategory = useMemo(
    () =>
      themes
        .filter((el) => !el.isfirst)
        .sort((a, b) => sortByName(language, a, b)),
    [themes, language]
  );

  const FirstThemesCategory = useMemo(
    () => themes.filter((el) => el.isfirst),
    [themes]
  );

  const themesDisplay = [...FirstThemesCategory, ...themesCategory];

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <JsonLanguageBlock variant="h2" sx={{ ml: 2 }} value={category.name} />
        <Button
          variant="outlined"
          sx={{
            minWidth: "auto",
            textTransform: "uppercase",
            "&:hover": {
              border: "2px solid currentColor",
            },
          }}
          color="secondary"
          size="small"
          onClick={() => navigate(`/category/${category.id}`)}
        >
          <Typography variant="h6" noWrap>
            {t("commun.seeall")}
          </Typography>
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: px(10),
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {themesDisplay.map((theme) => (
            <CardTheme key={theme.id} theme={theme} />
          ))}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
