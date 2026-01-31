import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ReportModal } from "src/component/modal/ReportModal";
import { PageBarNavigation } from "src/component/page/PageBarNavigation";
import { Colors } from "src/style/Colors";

export default function ReportPage() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <>
      <Helmet>
        <title>{`${t("pages.report.title")} - ${t("appname")}`}</title>
      </Helmet>
      <PageBarNavigation title={t("pages.report.title")}>
        <Grid container spacing={1} sx={{ p: 1 }}>
          <Grid sx={{ textAlign: "center" }} size={12}>
            <Typography variant="body1">
              {t("commun.signalproblemtext")}
            </Typography>
          </Grid>
          <Grid size={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => setOpen(true)}
              sx={{ backgroundColor: Colors.grey2 }}
            >
              <Typography variant="h6">{t("commun.reportproblem")}</Typography>
            </Button>
          </Grid>
        </Grid>
      </PageBarNavigation>
      <ReportModal open={open} close={() => setOpen(false)} />
    </>
  );
}
