import { uniqBy } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { MAX_DAY_NEW_THEME } from "src/utils/config";
import { sortByCreatedAt } from "src/utils/sort";
import { CategoryBlock } from "./category/CategoryBlock";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";

export const NewBlock = () => {
  const { t } = useTranslation();
  const { themes } = useApp();

  const themesNew = useMemo(() => {
    return uniqBy(
      themes
        .filter(
          (el) => moment().diff(el.created_at, "days") < MAX_DAY_NEW_THEME
        )
        .sort(sortByCreatedAt)
        .map((el) => ({
          id: el.id,
          name: el.name,
          image: el.image,
          color: el.color,
          link: `/theme/${el.id}`,
          type: TypeCardEnum.THEME,
        })),
      (el) => el.id
    );
  }, [themes]);

  return (
    themesNew.length > 0 && (
      <CategoryBlock
        title={t("commun.new")}
        count={themesNew.length}
        link={`/new`}
        values={themesNew}
      />
    )
  );
};
