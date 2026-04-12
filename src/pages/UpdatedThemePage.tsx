import { Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectThemesByModifiedAt } from "src/api/theme";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { Theme } from "src/models/Theme";
import { MAX_DAY_UPDATED_THEME } from "src/utils/config";

export default function UpdatedThemePage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  useEffect(() => {
    const getThemes = () => {
      setIsLoading(true);
      const date = moment().subtract(MAX_DAY_UPDATED_THEME, "days");
      selectThemesByModifiedAt(date).then(({ data }) => {
        setThemes(data ?? []);
        setIsLoading(false);
      });
    };
    getThemes();
  }, []);

  const themesByLanguage: Array<ICardImage> = useMemo(() => {
    return language
      ? [...themes]
          .filter((theme) =>
            theme.themetranslation.find((tt) => tt.language.id === language.id),
          )
          .map((el) => {
            const name = [...el.themetranslation].find(
              (tt) => tt.language.id === language.id,
            );
            return {
              id: el.id,
              name: name?.name ?? "",
              image: el.image,
              color: el.color,
              type: SearchType.THEME,
              minversion: el.minversion,
              created_at: el.created_at,
            };
          })
      : [];
  }, [themes, language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.updated.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <PageCategoryBlock
          title={t("pages.updated.title")}
          values={themesByLanguage}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
