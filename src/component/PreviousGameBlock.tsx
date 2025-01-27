import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectLastXThemeByPlayer } from "src/api/game";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { PreviousGame } from "src/models/PreviousGame";
import { Theme } from "src/models/Theme";
import { CategoryBlock } from "./category/CategoryBlock";
import { ICardImage } from "./card/CardImage";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";

export const PreviousGameBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { themes } = useApp();

  const [themesPrevious, setThemesPrevious] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (user) {
      selectLastXThemeByPlayer(user.id, 10).then(({ data }) => {
        const res = data as Array<PreviousGame>;
        const previousTheme = res.map((el) => el.theme);
        const result = previousTheme
          .reduce((acc, id) => {
            const theme = themes.find((el) => el.id === id);
            return theme ? [...acc, theme] : acc;
          }, [] as Array<Theme>)
          .map((el) => ({
            id: el.id,
            name: el.name,
            image: el.image,
            color: el.color,
            link: `/theme/${el.id}`,
            type: TypeCardEnum.THEME,
          }));

        setThemesPrevious(result);
      });
    }
  }, [themes, user]);

  return (
    themesPrevious.length > 0 && (
      <CategoryBlock
        title={t("commun.previousgame")}
        count={themesPrevious.length}
        values={themesPrevious}
      />
    )
  );
};
