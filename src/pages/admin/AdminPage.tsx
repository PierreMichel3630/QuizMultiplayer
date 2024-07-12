import { Box, Grid } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet } from "react-router-dom";
import { DefaultTabsLink } from "src/component/Tabs";

export default function AdminPage() {
  const { t } = useTranslation();

  const [tab, setTab] = useState(0);
  const tabs = [
    {
      label: t("commun.question"),
      link: "/administration/question",
    },
    {
      label: t("commun.report"),
      link: "/administration/report",
    },
    {
      label: t("commun.themes"),
      link: "/administration/themes",
    },
  ];

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DefaultTabsLink values={tabs} tab={tab} onChange={setTab} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Outlet />
        </Box>
      </Grid>
    </Grid>
  );
}
