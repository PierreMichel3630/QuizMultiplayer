import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectThemesByModifiedAt } from "src/api/theme";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { ICardImage } from "../card/CardImage";
import { CategoryBlock } from "../category/CategoryBlock";

export const UpdatedThemeBlock = () => {
  const { t } = useTranslation();
  const [themes, setThemes] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const getThemes = () => {
      const date = moment().subtract(7, "days");
      selectThemesByModifiedAt(date).then(({ data }) => {
        const res = (data ?? []).map((el) => ({
          ...el,
          type: TypeCardEnum.THEME,
        }));
        setThemes(res);
      });
    };
    getThemes();
  }, []);

  return (
    themes.length > 0 && (
      <CategoryBlock
        title={t("commun.updated")}
        count={themes.length}
        link={`/updated`}
        values={themes}
      />
    )
  );
};
