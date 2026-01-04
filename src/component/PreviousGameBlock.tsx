import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectLastXThemeByPlayer } from "src/api/game";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { PreviousGame } from "src/models/PreviousGame";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";
import { Theme } from "src/models/Theme";
import { useUser } from "src/context/UserProvider";

export const PreviousGameBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { language } = useUser();

  const [themesPrevious, setThemesPrevious] = useState<Array<Theme>>([]);

  useEffect(() => {
    if (user) {
      selectLastXThemeByPlayer(user.id, 10).then(({ data }) => {
        const res = data as Array<PreviousGame>;
        const previousTheme = res.map((el) => el.theme);
        setThemesPrevious(previousTheme);
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
    themesPrevious.length > 0 && (
      <CategoryBlock
        title={t("commun.previousgame")}
        count={themesPrevious.length}
        link={`/previousgame`}
        values={values}
      />
    )
  );
};
