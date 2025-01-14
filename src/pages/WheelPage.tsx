import { Grid } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { TitleBlock } from "src/component/title/Title";

export default function WheelPage() {
  const { t } = useTranslation();

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.wheel.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <TitleBlock title={t("commun.rewardwheel")} />
      </Grid>
    </Grid>
  );
}
