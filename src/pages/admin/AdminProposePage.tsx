import { Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AdminQuestionProposeBlock } from "src/component/admin/AdminQuestionProposeBlock";
import { AdminThemeProposeBlock } from "src/component/admin/AdminThemeProposeBlock";
import { DefaultTabs } from "src/component/Tabs";

export default function AdminProposePage() {
  const { t } = useTranslation();
  const [tab, setTab] = useState(0);
  const tabs = useMemo(
    () => [{ label: t("commun.themes") }, { label: t("commun.questions") }],
    [t]
  );
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <DefaultTabs
          values={tabs}
          tab={tab}
          onChange={(value) => {
            setTab(value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {tab === 0 ? <AdminThemeProposeBlock /> : <AdminQuestionProposeBlock />}
      </Grid>
    </Grid>
  );
}
