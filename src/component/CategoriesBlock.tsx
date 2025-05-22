import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "./category/CategoryBlock";

import { countCategory, selectCategories } from "src/api/category";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { ICardImage } from "./card/CardImage";

export const CategoriesBlock = () => {
  const { t } = useTranslation();

  const [total, setTotal] = useState(0);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const getTotal = () => {
      countCategory().then(({ count }) => {
        setTotal(count ?? 0);
      });
    };
    const getCategories = () => {
      selectCategories().then(({ data }) => {
        const res = data ?? [];
        setItemsSearch(
          [...res].map((el) => ({
            id: el.id,
            name: el.name,
            type: TypeCardEnum.CATEGORY,
          }))
        );
      });
    };
    getCategories();
    getTotal();
  }, []);

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
