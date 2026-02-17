import { Box, Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CardImage } from "src/component/card/CardImage";
import { TitleBlock } from "src/component/title/Title";
import { useGameModes } from "src/hook/useGameModes";

export default function GameModePage() {
  const { t } = useTranslation();
  const { allValues } = useGameModes();

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.gamemode.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            <Grid size={12}>
              <TitleBlock title={t("pages.gamemode.title")} />
            </Grid>
            {allValues.map((value, index) => (
              <Grid key={index}>
                <CardImage value={value} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
