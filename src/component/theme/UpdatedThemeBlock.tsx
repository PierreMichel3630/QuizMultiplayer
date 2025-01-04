import { uniqBy } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { MAX_DAY_UPDATED_THEME } from "src/utils/config";
import { sortByModifyAt } from "src/utils/sort";
import { CategoryBlock } from "../category/CategoryBlock";

export const UpdatedThemeBlock = () => {
  const { t } = useTranslation();
  const { themes } = useApp();

  const themesNew = useMemo(() => {
    return uniqBy(
      themes
        .filter(
          (el) => moment().diff(el.modify_at, "days") < MAX_DAY_UPDATED_THEME
        )
        .sort(sortByModifyAt)
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
        title={t("commun.updated")}
        count={themesNew.length}
        link={`/updated`}
        values={themesNew}
      />
    )
  );
};
