import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectThemesByModifiedAt } from "src/api/theme";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { Theme } from "src/models/Theme";
import { CategoryBlock } from "../category/CategoryBlock";

export const UpdatedThemeBlock = () => {
  const { t } = useTranslation();
  const [themes, setThemes] = useState<Array<Theme>>([]);

  useEffect(() => {
    const getThemes = () => {
      const date = moment().subtract(7, "days");
      selectThemesByModifiedAt(date).then(({ data }) => {
        setThemes(data ?? []);
      });
    };
    getThemes();
  }, []);

  const themesNew = useMemo(
    () =>
      [...themes].map((el) => ({
        id: el.id,
        name: el.name,
        image: el.image,
        color: el.color,
        link: `/theme/${el.id}`,
        type: TypeCardEnum.THEME,
      })),
    [themes]
  );

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
