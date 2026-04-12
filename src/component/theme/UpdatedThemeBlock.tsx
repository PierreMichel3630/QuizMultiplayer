import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { ICardImage } from "../card/CardImage";
import { CategoryBlock } from "../category/CategoryBlock";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { selectThemesByModifiedAt } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { MAX_DAY_UPDATED_THEME } from "src/utils/config";

export const UpdatedThemeBlock = () => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [themes, setThemes] = useState<Array<Theme>>([]);

  useEffect(() => {
    const getThemes = () => {
      setIsLoading(true);
      const date = moment().subtract(MAX_DAY_UPDATED_THEME, "days");
      selectThemesByModifiedAt(date).then(({ data }) => {
        setThemes(data ?? []);
        setIsLoading(false);
      });
    };
    getThemes();
  }, []);

  const themesByLanguage: Array<ICardImage> = useMemo(() => {
    return language
      ? [...themes]
          .filter((theme) =>
            theme.themetranslation.find((tt) => tt.language.id === language.id),
          )
          .map((el) => {
            const name = [...el.themetranslation].find(
              (tt) => tt.language.id === language.id,
            );
            return {
              id: el.id,
              name: name?.name ?? "",
              image: el.image,
              color: el.color,
              type: SearchType.THEME,
              minversion: el.minversion,
              created_at: el.created_at,
            };
          })
      : [];
  }, [themes, language]);

  return (
    themes.length > 0 && (
      <CategoryBlock
        title={t("commun.updated")}
        count={themes.length}
        link={`/updated`}
        values={themesByLanguage}
        isLoading={isLoading}
      />
    )
  );
};
