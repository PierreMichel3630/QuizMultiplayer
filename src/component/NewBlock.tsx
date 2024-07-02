import { Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { sortByCreatedAt } from "src/utils/sort";
import { CardTheme } from "./card/CardTheme";
import { uniqBy } from "lodash";

export const NewBlock = () => {
  const { t } = useTranslation();

  const { themes } = useApp();

  const themesNew = useMemo(() => {
    return uniqBy(
      themes.filter((el) => moment().diff(el.created_at, "days") < 7),
      (el) => el.id
    );
  }, [themes]);

  const themesDisplay = useMemo(() => {
    return [...themesNew].sort(sortByCreatedAt);
  }, [themesNew]);

  return (
    <Grid container spacing={1}>
      <Grid
        item
        xs={12}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h2">{t("commun.new")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: px(5),
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
