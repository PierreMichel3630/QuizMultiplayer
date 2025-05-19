import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getThemesAndCategoriesById } from "src/api/search";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";

export default function FavoritePage() {
  const { t } = useTranslation();
  const { favorites } = useApp();
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (favorites.length > 0) {
      const idCategories = [...favorites]
        .filter((el) => el.category)
        .map((el) => Number(el.category));
      const idThemes = [...favorites]
        .filter((el) => el.theme)
        .map((el) => Number(el.theme));
      getThemesAndCategoriesById(idCategories, idThemes).then(({ data }) => {
        setItemsSearch(data ?? []);
      });
    }
  }, [favorites]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.favorite.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock
          title={t("pages.favorite.title")}
          values={itemsSearch}
        />
      </Grid>
    </Grid>
  );
}
