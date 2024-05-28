import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";

import WarningIcon from "@mui/icons-material/Warning";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";
import { ModeBlock } from "./ModeBlock";

export const RuleBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const warnings = [t("warning.warning1")];
  const rules = [t("rules.step1"), t("rules.step2"), t("rules.step3")];
  const modes = [
    {
      title: t("modes.mode1.title"),
      goal: t("modes.mode1.goal"),
      explain: t("modes.mode1.explain"),
    },
    {
      title: t("modes.mode2.title"),
      goal: t("modes.mode2.goal"),
      explain: t("modes.mode2.explain"),
    },
    {
      title: t("modes.mode3.title"),
      goal: t("modes.mode3.goal"),
      explain: t("modes.mode3.explain"),
    },
  ];
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Divider>
          <Typography variant="h4">{t("commun.rules")}</Typography>
        </Divider>
      </Grid>
      {rules.map((rule, index) => (
        <Grid item xs={12} key={index}>
          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: percent(100),
              borderRadius: 2,
              height: percent(100),
              backgroundColor: Colors.blue3,
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30, backgroundColor: Colors.white }}
            >
              <Typography variant="h4" color="secondary">
                {index + 1}
              </Typography>
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              {rule}
            </Typography>
          </Box>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Divider>
          <Typography variant="h4">{t("commun.modes")}</Typography>
        </Divider>
      </Grid>
      {modes.map((mode) => (
        <Grid item xs={12}>
          <ModeBlock mode={mode} />
        </Grid>
      ))}
      {user === null && (
        <>
          <Grid item xs={12}>
            <Divider>
              <Typography variant="h4">{t("commun.warnings")}</Typography>
            </Divider>
          </Grid>
          {warnings.map((warning, index) => (
            <Grid item xs={12} key={index}>
              <Box
                sx={{
                  p: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  background: "rgba(255,165,0,.65)",
                  width: percent(100),
                  borderRadius: 2,
                }}
              >
                <Avatar sx={{ bgcolor: Colors.white }}>
                  <WarningIcon sx={{ color: Colors.orange }} />
                </Avatar>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: 12 }}
                >
                  {warning}
                </Typography>
              </Box>
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};
