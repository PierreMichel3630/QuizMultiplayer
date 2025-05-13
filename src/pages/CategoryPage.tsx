import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { deleteFavoriteById, insertFavorite } from "src/api/favorite";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { FavoriteInsert } from "src/models/Favorite";
import { sortByName } from "src/utils/sort";

export default function CategoryPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { language } = useUser();
  const { categories, themes, favorites, getFavorite } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [category, setCategory] = useState<Category | undefined>(undefined);

  useEffect(() => {
    setCategory(categories.find((el) => el.id === Number(id)));
  }, [categories, id]);

  const themesCategory = useMemo(
    () =>
      category
        ? themes
            .filter((el) => el.category?.id === category.id && !el.isfirst)
            .sort((a, b) => sortByName(language, a, b))
        : [],
    [category, themes, language]
  );

  const FirstThemesCategory = useMemo(
    () =>
      category
        ? themes.filter((el) => el.category?.id === category.id && el.isfirst)
        : [],
    [category, themes]
  );

  const themesDisplay = useMemo(
    () =>
      [...FirstThemesCategory, ...themesCategory].map((el) => ({
        id: el.id,
        name: el.name,
        image: el.image,
        color: el.color,
        link: `/theme/${el.id}`,
        type: TypeCardEnum.THEME,
      })),
    [FirstThemesCategory, themesCategory]
  );

  const favorite = useMemo(
    () => favorites.find((el) => el.category === Number(id)),
    [id, favorites]
  );

  const addFavorite = () => {
    if (user) {
      if (category) {
        if (favorite) {
          deleteFavoriteById(favorite.id).then(({ error }) => {
            if (error) {
              setSeverity("error");
              setMessage(t("commun.error"));
            } else {
              setSeverity("success");
              setMessage(t("alert.deletefavorite"));
              getFavorite();
            }
          });
        } else {
          const newFavorite: FavoriteInsert = {
            category: category.id,
          };
          insertFavorite(newFavorite).then(({ error }) => {
            if (error) {
              setSeverity("error");
              setMessage(t("commun.error"));
            } else {
              setSeverity("success");
              setMessage(t("alert.addfavorite"));
              getFavorite();
            }
          });
        }
      }
    } else {
      navigate(`/login`);
    }
  };

  return (
    <Grid container>
      <Helmet>
        <title>
          {category
            ? `${category.name[language.iso]} - ${t("appname")}`
            : t("appname")}
        </title>
        {category && (
          <meta
            name="description"
            content={`${t("appname")} Catégorie ${category.name[language.iso]}`}
          />
        )}
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock
          title={category?.name}
          values={themesDisplay}
          addFavorite={addFavorite}
          favorite={favorite !== undefined}
        />
      </Grid>
    </Grid>
  );
}
