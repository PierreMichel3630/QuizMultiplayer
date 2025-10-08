import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectLastXThemeByPlayer } from "src/api/game";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { PreviousGame } from "src/models/PreviousGame";
import { Theme } from "src/models/Theme";

export default function PreviousThemePage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [themesPrevious, setThemesPrevious] = useState<Array<Theme>>([]);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      selectLastXThemeByPlayer(user.id, 10).then(({ data }) => {
        const res = data as Array<PreviousGame>;
        const previousTheme = uniqBy(
          res.map((el) => el.theme),
          (el) => el.id
        );

        setThemesPrevious(previousTheme);
        setIsLoading(false);
      });
    }
  }, [user]);

  const values = useMemo(
    () =>
      themesPrevious.map((el) => ({
        id: el.id,
        name: el.title,
        image: el.image,
        color: el.color,
        link: `/theme/${el.id}`,
        type: TypeCardEnum.THEME,
      })),
    [themesPrevious]
  );

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.previousgame.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock
          title={t("pages.previousgame.title")}
          values={values}
          isLoading={isLoading}
        />
      </Grid>
    </Grid>
  );
}
