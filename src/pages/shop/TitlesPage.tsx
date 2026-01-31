import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectTitles } from "src/api/title";
import { TitleShop } from "src/component/shop/TitleShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { Title } from "src/models/Title";
import { sortByIsaccomplishmentAndPriceDesc } from "src/utils/sort";

export default function TitlesPage() {
  const { t } = useTranslation();
  const { myTitles } = useApp();

  const [titles, setTitles] = useState<Array<Title>>([]);

  useEffect(() => {
    const getTitles = () => {
      selectTitles().then(({ data }) => {
        const value = data !== null ? (data as Array<Title>) : [];
        setTitles(value);
      });
    };
    getTitles();
  }, []);

  const titlesDisplay = useMemo(() => {
    const idsBuy = myTitles.map((el) => el.title.id);
    return [...titles]
      .filter((el) => !idsBuy.includes(el.id))
      .sort(sortByIsaccomplishmentAndPriceDesc);
  }, [titles, myTitles]);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Helmet>
          <title>{`${t("pages.titles.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid size={12}>
          <TitleBlock title={t("commun.titles")} />
        </Grid>
        {titlesDisplay.map((title) => (
          <Grid
            key={title.id}
            size={{
              xs: 12,
              sm: 6
            }}>
            <TitleShop title={title} noWrap={false} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
