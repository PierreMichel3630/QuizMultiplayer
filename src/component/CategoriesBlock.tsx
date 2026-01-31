import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "./category/CategoryBlock";

import { countCategoryByLanguage } from "src/api/category";
import { getCategories } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "./card/CardImage";

export const CategoriesBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [total, setTotal] = useState(0);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (language) {
      countCategoryByLanguage(language).then(({ count }) => {
        setTotal(count ?? 0);
      });
      getCategories(language).then(({ data }) => {
        setItemsSearch(data ?? []);
      });
    }
  }, [language]);

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        {itemsSearch.length > 0 && (
          <CategoryBlock
            title={t("commun.categories")}
            count={total}
            link={`/categories`}
            values={itemsSearch}
          />
        )}
      </Grid>
    </Grid>
  );
};
