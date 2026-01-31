import { Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getThemesByModifiedAt } from "src/api/search";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useUser } from "src/context/UserProvider";

export default function UpdatedThemePage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [themes, setThemes] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const getThemes = () => {
      if (language) {
        setIsLoading(true);
        const date = moment().subtract(7, "days");
        getThemesByModifiedAt(language, date).then(({ data }) => {
          setThemes(data ?? []);
          setIsLoading(false);
        });
      }
    };
    getThemes();
  }, [language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.updated.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <PageCategoryBlock
          title={t("pages.updated.title")}
          values={themes}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
