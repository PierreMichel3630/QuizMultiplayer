import { Box, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { CardCategory } from "src/component/card/CardCategory";
import { HeadTitle } from "src/component/HeadTitle";
import { useApp } from "src/context/AppProvider";

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { categories } = useApp();

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.categories.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <HeadTitle title={t("commun.categories")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            {categories.map((category) => (
              <Grid item key={category.id}>
                <CardCategory category={category} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
