import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectMostPlayedTheme } from "src/api/theme";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { Theme } from "src/models/Theme";
import { MAX_MOST_PLAYED_THEME } from "src/utils/config";

export default function MostPlayedThemePage() {
  const { t } = useTranslation();
  const { language } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (language) {
      setIsLoading(true);
      selectMostPlayedTheme(language, MAX_MOST_PLAYED_THEME).then(
        ({ data }) => {
          const res: Array<Theme> = data ?? [];
          const values: Array<ICardImage> = [...res].map((el) => ({
            id: el.id,
            name: el.themetranslation[0].name ?? "",
            color: el.color,
            image: el.image,
            type: SearchType.THEME,
          }));
          setItemsSearch(values);
          setIsLoading(false);
        }
      );
    }
  }, [language]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.mostplayedthemes.title")} - ${t(
          "appname"
        )}`}</title>
      </Helmet>
      <Grid size={12}>
        <PageCategoryBlock
          title={t("pages.mostplayedthemes.title")}
          values={itemsSearch}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
