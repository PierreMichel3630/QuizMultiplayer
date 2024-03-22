import { Avatar, Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";

import WarningIcon from "@mui/icons-material/Warning";
import { Colors } from "src/style/Colors";
import { useAuth } from "src/context/AuthProviderSupabase";

export const RuleBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const rules = [
    { number: 1, label: t("rules.step1") },
    { number: 2, label: t("rules.step2") },
  ];

  const warnings = [{ label: t("warning.warning1") }];
  return (
    <Grid container spacing={1}>
      {rules.map((rule, index) => (
        <Grid item xs={12} md={6} key={index}>
          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              background: "rgba(255,255,255,.15)",
              width: percent(100),
              borderRadius: 2,
            }}
          >
            <Avatar sx={{ width: 30, height: 30 }}>
              <Typography variant="h4" color="text.primary">
                {rule.number}
              </Typography>
            </Avatar>
            <Typography variant="h6">{rule.label}</Typography>
          </Box>
        </Grid>
      ))}
      {user === null &&
        warnings.map((warning, index) => (
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
              <Typography variant="caption">{warning.label}</Typography>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};
