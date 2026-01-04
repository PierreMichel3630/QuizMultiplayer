import { Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectCategoryById } from "src/api/category";
import { deleteFavoriteById, insertFavorite } from "src/api/favorite";
import { countThemesByCategory, selectThemesByCategory } from "src/api/theme";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { Category } from "src/models/Category";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { FavoriteInsert } from "src/models/Favorite";

export default function CategoryPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const { language } = useUser();
  const { favorites, getFavorite } = useApp();
  const { setMessage, setSeverity } = useMessage();

  const [category, setCategory] = useState<Category | null>(null);
  const [themes, setThemes] = useState<Array<ICardImage>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [count, setCount] = useState<undefined | number>(undefined);
  const [, setPage] = useState(0);

  const getTheme = useCallback(
    (page: number) => {
      setIsLoading(true);
      if (language && category) {
        selectThemesByCategory(language, category.id, "", page, 50).then(
          ({ data }) => {
            const res = (data ?? []).map((el) => ({
              ...el,
              type: TypeCardEnum.THEME,
            }));
            setThemes((prev) => (page === 0 ? [...res] : [...prev, ...res]));
            setIsLoading(false);
          }
        );
      }
    },
    [category, language]
  );

  useEffect(() => {
    getTheme(0);
  }, [category, language]);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      selectCategoryById(id).then(({ data }) => {
        setCategory(data);
      });
    }
  }, [id, language]);

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

  useEffect(() => {
    const getCount = () => {
      if (language && category) {
        countThemesByCategory(category.id, language).then(({ count }) => {
          setCount(count ?? 0);
        });
      }
    };
    getCount();
  }, [category, language]);

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
      <Grid size={12}>
        <PageCategoryBlock
          title={title}
          values={themes}
          addFavorite={addFavorite}
          favorite={favorite !== undefined}
          isLoading={isLoading}
          count={count}
          handleScroll={() =>
            setPage((prev) => {
              getTheme(prev + 1);
              return prev + 1;
            })
          }
        />
      </Grid>
    </Grid>
  );
}
