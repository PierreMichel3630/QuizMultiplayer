import { Box, Button, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { sortByCreatedAt } from "src/utils/sort";
import { CardTheme } from "./card/CardTheme";

interface Props {
  search?: string;
}
export const NewBlock = ({ search }: Props) => {
  const { t } = useTranslation();

  const { themes } = useApp();

  const themesNew = useMemo(() => {
    return themes.filter((el) => moment().diff(el.created_at, "days") < 7);
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
        {!(search !== "") && (
          <Button
            variant="outlined"
            sx={{
              textTransform: "uppercase",
              "&:hover": {
                border: "2px solid currentColor",
              },
            }}
            color="secondary"
            size="small"
            href={`/favorite`}
          >
            <Typography variant="h6">{t("commun.seeall")}</Typography>
          </Button>
        )}
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
            <Box key={theme.id} sx={{ maxWidth: px(100) }}>
              <CardTheme theme={theme} />
            </Box>
          ))}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
