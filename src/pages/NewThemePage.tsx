import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import moment from "moment";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { PageCategoryBlock } from "src/component/page/PageCategoryBlock";
import { useApp } from "src/context/AppProvider";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { MAX_DAY_NEW_THEME } from "src/utils/config";
import { sortByCreatedAt } from "src/utils/sort";

export default function NewThemePage() {
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
    <Grid container>
      <Helmet>
        <title>{`${t("pages.new.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <PageCategoryBlock title={t("pages.new.title")} values={themesNew} />
      </Grid>
    </Grid>
  );
}
