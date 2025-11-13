import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectCategoryById } from "src/api/category";
import { deleteFavoriteById, insertFavorite } from "src/api/favorite";
import { selectThemesByCategory } from "src/api/theme";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { FavoriteInsert } from "src/models/Favorite";
import { Theme } from "src/models/Theme";

export default function CategoryPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { language } = useUser();
  const { favorites, getFavorite } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [category, setCategory] = useState<Category | null>(null);
  const [themes, setThemes] = useState<Array<Theme>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      selectCategoryById(id).then(({ data }) => {
        setCategory(data);
      });
      if (language) {
        selectThemesByCategory(language, id).then(({ data }) => {
          setThemes(data ?? []);
          setIsLoading(false);
        });
      }
    }
  }, [id, language]);

  const themesDisplay = useMemo(
    () =>
      [...themes].map((el) => {
        const translation = [...el.themetranslation].find(
          (el) => el.language.id === language?.id
        );
        return {
          id: el.id,
          name: translation?.name ?? el.themetranslation[0].name,
          image: el.image,
          color: el.color,
          link: `/theme/${el.id}`,
          type: TypeCardEnum.THEME,
        };
      }),
    [themes, language]
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

  const title = useMemo(() => {
    if (category && language) {
      const translations = [...category.categorytranslation];
      const trad = translations.find((el) => el.language.id === language.id);
      return trad ? trad.name : translations[1].name;
    } else {
      return "";
    }
  }, [language, category]);

  return (
    <Grid container>
      <Helmet>
        <title>{title ? `${title} - ${t("appname")}` : t("appname")}</title>
        {category && (
          <meta
            name="description"
            content={`${t("appname")} - ${t("category")} ${title}`}
          />
        )}
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock
          title={title}
          values={themesDisplay}
          addFavorite={addFavorite}
          favorite={favorite !== undefined}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
