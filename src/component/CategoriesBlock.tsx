import { Grid } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";
import { CategoryBlock } from "./category/CategoryBlock";
import { SkeletonCategories } from "./skeleton/SkeletonCategory";

import BoltIcon from "@mui/icons-material/Bolt";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";

export const CategoriesBlock = () => {
  const { t } = useTranslation();
  const { categories, isLoadingCategories } = useApp();

  const categoriesFormat = useMemo(
    () =>
      categories.map((el) => ({
        id: el.id,
        name: el.name,
        image: (
          <BoltIcon
            sx={{
              width: 80,
              height: 80,
              color: "white",
            }}
          />
        ),
        color: Colors.colorApp,
        link: `/category/${el.id}`,
        type: TypeCardEnum.CATEGORY,
      })),
    [categories]
  );

  return (
    <Grid container spacing={1}>
      {isLoadingCategories ? (
        <SkeletonCategories number={1} />
      ) : (
        <Grid item xs={12}>
          {categories.length > 0 && (
            <CategoryBlock
              title={t("commun.categories")}
              count={categories.length}
              link={`/categories`}
              values={categoriesFormat}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};
