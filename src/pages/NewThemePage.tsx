import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getThemesAndCategoriesByDate } from "src/api/search";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useUser } from "src/context/UserProvider";

export default function NewThemePage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (language) {
      setIsLoading(true);
      getThemesAndCategoriesByDate(language).then(({ data }) => {
        setItemsSearch(data ?? []);
        setIsLoading(false);
      });
    }
  }, [language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.new.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <PageCategoryBlock
          title={t("pages.new.title")}
          values={itemsSearch}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
