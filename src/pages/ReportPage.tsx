import { Box, Button, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { HeadTitle } from "src/component/HeadTitle";
import { ReportModal } from "src/component/modal/ReportModal";
import { Colors } from "src/style/Colors";

export default function ReportPage() {
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.report.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <HeadTitle title={t("pages.report.title")} />
      </Grid>
      <Grid size={12}>
        <Box sx={{ width: percent(100), p: 1, mt: 2 }}>
          <Grid container spacing={1}>
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
                <Typography variant="h6">
                  {t("commun.reportproblem")}
                </Typography>
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Grid>
      <ReportModal open={open} close={() => setOpen(false)} />
    </Grid>
  );
}
