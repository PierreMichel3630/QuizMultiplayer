import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "./category/CategoryBlock";

import { selectMostPlayedTheme } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { MAX_MOST_PLAYED_THEME } from "src/utils/config";
import { ICardImage } from "./card/CardImage";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";

export const MostPlayedThemeBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (language) {
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
        }
      );
    }
  }, [language]);

  return (
    <CategoryBlock
      title={t("commun.mostplayed")}
      count={itemsSearch.length}
      link={`/mostplayedthemes`}
      values={itemsSearch}
    />
  );
};
