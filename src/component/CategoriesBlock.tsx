import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "./category/CategoryBlock";

import { countCategory, selectCategories } from "src/api/category";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { ICardImage } from "./card/CardImage";
import { useUser } from "src/context/UserProvider";

export const CategoriesBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [total, setTotal] = useState(0);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const getTotal = () => {
      countCategory(language.iso).then(({ count }) => {
        setTotal(count ?? 0);
      });
    };
    const getCategories = () => {
      selectCategories(language.iso).then(({ data }) => {
        const res = data ?? [];
        setItemsSearch(
          [...res].map((el) => ({
            id: el.id,
            title: el.title,
            type: TypeCardEnum.CATEGORY,
          }))
        );
      });
    };
    getCategories();
    getTotal();
  }, [language]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
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
