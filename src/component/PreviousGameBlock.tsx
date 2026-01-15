import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectLastPlayedThemeByProfile } from "src/api/game";
import { selectThemeByIds } from "src/api/theme";
import { useAuth } from "src/context/AuthProviderSupabase";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { Theme } from "src/models/Theme";
import { MAX_LAST_PLAYED_THEME } from "src/utils/config";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";
import { sortByIds } from "src/utils/sort";

export const PreviousGameBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

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
      });
    }
  }, [idsTheme]);

  return (
    itemsSearch.length > 0 && (
      <CategoryBlock
        title={t("commun.previousgame")}
        count={itemsSearch.length}
        link={`/previousgame`}
        values={itemsSearch}
      />
    )
  );
};
