import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getThemesAndCategoriesById } from "src/api/search";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";

export default function FavoritePage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { favorites } = useApp();

  const [isLoading, setIsLoading] = useState(true);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (favorites.length > 0 && language) {
      setIsLoading(true);
      const idCategories = [...favorites]
        .filter((el) => el.category)
        .map((el) => Number(el.category));
      const idThemes = [...favorites]
        .filter((el) => el.theme)
        .map((el) => Number(el.theme));
      getThemesAndCategoriesById(language, idCategories, idThemes).then(
        ({ data }) => {
          setItemsSearch(data ?? []);
          setIsLoading(false);
        }
      );
    }
  }, [favorites, language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.favorite.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <PageCategoryBlock
          title={t("pages.favorite.title")}
          values={itemsSearch}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
