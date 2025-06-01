import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { selectThemesByModifiedAt } from "src/api/theme";
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
