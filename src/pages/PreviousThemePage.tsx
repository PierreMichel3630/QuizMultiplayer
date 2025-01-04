import { Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectLastXThemeByPlayer } from "src/api/game";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { PreviousGame } from "src/models/PreviousGame";
import { Theme } from "src/models/Theme";

export default function PreviousThemePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { themes } = useApp();

  const [themesPrevious, setThemesPrevious] = useState<Array<Theme>>([]);

  useEffect(() => {
    if (user) {
      selectLastXThemeByPlayer(user.id, 10).then(({ data }) => {
        const res = data as Array<PreviousGame>;
        const previousTheme = res.map((el) => el.theme);
        const result = previousTheme.reduce((acc, id) => {
          const theme = themes.find((el) => el.id === id);
          return theme ? [...acc, theme] : acc;
        }, [] as Array<Theme>);

        setThemesPrevious(result);
      });
    }
  }, [themes, user]);

  const values = useMemo(
    () =>
      themesPrevious.map((el) => ({
        id: el.id,
        name: el.name,
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
        />
      </Grid>
    </Grid>
  );
}
