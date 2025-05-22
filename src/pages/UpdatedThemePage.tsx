import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectThemesByModifiedAt } from "src/api/theme";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { Theme } from "src/models/Theme";

export default function UpdatedThemePage() {
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

  const themesNew = useMemo(() => {
    return uniqBy(
      themes.map((el) => ({
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
    <Grid container>
      <Helmet>
        <title>{`${t("pages.updated.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock
          title={t("pages.updated.title")}
          values={themesNew}
        />
      </Grid>
    </Grid>
  );
}
