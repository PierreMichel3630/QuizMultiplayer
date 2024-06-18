import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { sortByName } from "src/utils/sort";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { CardTheme } from "./card/CardTheme";
import { useNavigate } from "react-router-dom";

interface Props {
  category: Category;
}
export const CategoryBlock = ({ category }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { themes } = useApp();
  const { language } = useUser();

  const themesCategory = useMemo(
    () =>
      themes
        .filter((el) => el.category.id === category.id && !el.isfirst)
        .sort((a, b) => sortByName(language, a, b)),
    [category, themes, language]
  );

  const FirstThemesCategory = useMemo(
    () => themes.filter((el) => el.category.id === category.id && el.isfirst),
    [category, themes]
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
