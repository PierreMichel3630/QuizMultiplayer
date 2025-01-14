import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { TitleShop } from "src/component/shop/TitleShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { sortByPriceDesc } from "src/utils/sort";

export default function TitlesPage() {
  const { t } = useTranslation();
  const { titles } = useApp();

  const titlesDisplay = useMemo(
    () => [...titles].sort(sortByPriceDesc),
    [titles]
  );

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Helmet>
          <title>{`${t("pages.titles.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <TitleBlock title={t("commun.titles")} />
        </Grid>
        {titlesDisplay.map((title) => (
          <Grid item xs={6} key={title.id}>
            <TitleShop title={title} noWrap={false} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
