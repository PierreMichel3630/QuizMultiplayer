import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { getThemesAndCategoriesByDate } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";
import { useGames } from "src/hook/useGame";
import { MAX_DAY_NEW_THEME } from "src/utils/config";
import moment from "moment";


export const NewBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const games = useGames()

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    if (language) {
      getThemesAndCategoriesByDate(language).then(({ data }) => {
        setItemsSearch(data ?? []);
      });
    }
  }, [language]);

  const newGames = useMemo(() => [...games].filter(el => moment().diff(moment(el.created_at), "days") < MAX_DAY_NEW_THEME), [games])

  const items = useMemo(() => [...newGames, ...itemsSearch], [newGames, itemsSearch])

  return (
    items.length > 0 && (
      <CategoryBlock
        title={t("commun.new")}
        count={items.length}
        link={`/new`}
        values={items}
      />
    )
  );
};
