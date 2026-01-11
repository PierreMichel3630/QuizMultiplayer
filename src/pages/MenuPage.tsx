import { Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";

import { ShareApplicationBlock } from "src/component/ShareApplicationBlock";
import { MenuBlock } from "src/component/menus/MenuBlock";
import { PageBarNavigation } from "src/component/page/PageBarNavigation";

export default function MenuPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t("pages.menu.title")} - ${t("appname")}`}</title>
      </Helmet>
      <PageBarNavigation title={t("pages.menu.title")}>
        <Grid container>
          <Grid size={12}></Grid>
          <Grid sx={{ p: 1 }} size={12}>
            <ShareApplicationBlock title={t("commun.shareapplication")} />
          </Grid>
          <Grid size={12}>
            <MenuBlock />
          </Grid>
        </Grid>
      </PageBarNavigation>
    </>
  );
}
