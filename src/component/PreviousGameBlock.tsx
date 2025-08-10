import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectLastXThemeByPlayer } from "src/api/game";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { PreviousGame } from "src/models/PreviousGame";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";

export const PreviousGameBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const [themesPrevious, setThemesPrevious] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (user) {
      selectLastXThemeByPlayer(user.id, 10).then(({ data }) => {
        const res = data as Array<PreviousGame>;
        const previousTheme = res.map((el) => el.theme);
        const result = previousTheme.map((el) => ({
          id: el.id,
          name: el.title,
          image: el.image,
          color: el.color,
          type: TypeCardEnum.THEME,
        }));

        setThemesPrevious(result);
      });
    }
  }, [user]);

  return (
    themesPrevious.length > 0 && (
      <CategoryBlock
        title={t("commun.previousgame")}
        count={themesPrevious.length}
        link={`/previousgame`}
        values={themesPrevious}
      />
    )
  );
};
