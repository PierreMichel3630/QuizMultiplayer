import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { sortByName } from "src/utils/sort";
import BoltIcon from "@mui/icons-material/Bolt";
import { Colors } from "src/style/Colors";

export default function FavoritePage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { categories, themes, favorites } = useApp();

  const favoriteItems = useMemo(() => {
    const idFavoriteTheme = favorites
      .filter((el) => el.theme !== null)
      .map((el) => el.theme);
    const idFavoriteCategory = favorites
      .filter((el) => el.category !== null)
      .map((el) => el.category);
    const themesFilter = uniqBy(
      themes.filter((el) => idFavoriteTheme.includes(el.id)),
      (el) => el.id
    ).map((el) => ({
      id: el.id,
      name: el.name,
      image: el.image,
      color: el.color,
      link: `/theme/${el.id}`,
      type: TypeCardEnum.THEME,
    }));
    const categoriesFilter = uniqBy(
      categories.filter((el) => idFavoriteCategory.includes(el.id)),
      (el) => el.id
    ).map((el) => ({
      id: el.id,
      name: el.name,
      image: (
        <BoltIcon
          sx={{
            width: 80,
            height: 80,
            color: "white",
          }}
        />
      ),
      color: Colors.blue3,
      link: `/category/${el.id}`,
      type: TypeCardEnum.CATEGORY,
    }));
    return [...themesFilter, ...categoriesFilter].sort((a, b) =>
      sortByName(language, a, b)
    );
  }, [favorites, themes, categories, language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.favorite.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock
          title={t("pages.favorite.title")}
          values={favoriteItems}
        />
      </Grid>
    </Grid>
  );
}
