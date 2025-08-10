import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { getCategories } from "src/api/search";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useUser } from "src/context/UserProvider";

export default function CategoriesPage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (language) {
      getCategories(language).then(({ data }) => {
        setItemsSearch(data ?? []);
      });
    }
  }, [language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.categories.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock
          title={t("pages.categories.title")}
          values={itemsSearch}
        />
      </Grid>
    </Grid>
  );
}
