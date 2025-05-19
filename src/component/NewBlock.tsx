import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getThemesAndCategoriesByDate } from "src/api/search";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";

export const NewBlock = () => {
  const { t } = useTranslation();

  const [itemsSearch, setItemsSearch] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    getThemesAndCategoriesByDate().then(({ data }) => {
      setItemsSearch(data ?? []);
    });
  }, []);

  return (
    itemsSearch.length > 0 && (
      <CategoryBlock
        title={t("commun.new")}
        count={itemsSearch.length}
        link={`/new`}
        values={itemsSearch}
      />
    )
  );
};
