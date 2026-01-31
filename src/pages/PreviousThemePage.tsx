import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectLastPlayedThemeByProfile } from "src/api/game";
import { selectThemeByIds } from "src/api/theme";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { Theme } from "src/models/Theme";
import { MAX_LAST_PLAYED_THEME } from "src/utils/config";
import { sortByIds } from "src/utils/sort";

export default function PreviousThemePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [idsTheme, setIdsTheme] = useState<Array<number>>([]);
  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (user) {
      selectLastPlayedThemeByProfile(user.id, MAX_LAST_PLAYED_THEME).then(
        ({ data }) => {
          const res: Array<{ id: number }> = data ?? [];
          setIdsTheme([...res].map((el) => el.id));
        }
      );
    }
  }, [user]);

  useEffect(() => {
    if (idsTheme.length > 0) {
      setIsLoading(true);
      selectThemeByIds(idsTheme).then(({ data }) => {
        const res: Array<Theme> = data ?? [];
        const values: Array<ICardImage> = [...res]
          .map((el) => ({
            id: el.id,
            name: el.themetranslation[0].name ?? "",
            color: el.color,
            image: el.image,
            type: SearchType.THEME,
          }))
          .sort((a, b) => sortByIds(idsTheme, a, b));
        setItemsSearch(values);
        setIsLoading(false);
      });
    }
  }, [idsTheme]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.previousgame.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <PageCategoryBlock
          title={t("pages.previousgame.title")}
          values={itemsSearch}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
