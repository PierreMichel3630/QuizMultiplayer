import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectLastXThemeByPlayer } from "src/api/game";
import { ICardImage } from "src/component/card/CardImage";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { PreviousGame } from "src/models/PreviousGame";
import { Theme } from "src/models/Theme";

export default function PreviousThemePage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language } = useUser();

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

  const values = useMemo(() => {
    let result: Array<ICardImage> = [];
    if (language) {
      result = [...themesPrevious].map((el) => {
        const translation = [...el.themetranslation].find(
          (el) => el.language.id === language.id
        );
        return {
          id: el.id,
          name: translation?.name ?? el.themetranslation[0].name,
          image: el.image,
          color: el.color,
          link: `/theme/${el.id}`,
          type: TypeCardEnum.THEME,
        };
      });
    }
    return result;
  }, [themesPrevious, language]);

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
