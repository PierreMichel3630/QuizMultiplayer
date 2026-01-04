import moment from "moment";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getThemesByModifiedAt } from "src/api/search";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "../card/CardImage";
import { CategoryBlock } from "../category/CategoryBlock";

export const UpdatedThemeBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [themes, setThemes] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const getThemes = () => {
      if (language) {
        const date = moment().subtract(7, "days");
        getThemesByModifiedAt(language, date).then(({ data }) => {
          setThemes(data ?? []);
        });
      }
    };
    getThemes();
  }, [language]);

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
