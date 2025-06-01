import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectCategories } from "src/api/category";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";

export default function CategoriesPage() {
  const { t } = useTranslation();

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const getCategories = () => {
      selectCategories().then(({ data }) => {
        const res = data ?? [];
        setItemsSearch(
          res.map((el) => ({
            id: el.id,
            title: el.title,
            type: TypeCardEnum.CATEGORY,
          }))
        );
      });
    };
    getCategories();
  }, []);

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
