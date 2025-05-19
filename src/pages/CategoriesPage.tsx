import { Box, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectCategories } from "src/api/category";
import { CardImage, ICardImage } from "src/component/card/CardImage";
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
            name: el.name,
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
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1} justifyContent="center">
            {itemsSearch.map((value, index) => (
              <Grid item key={index}>
                <CardImage key={index} value={value} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
