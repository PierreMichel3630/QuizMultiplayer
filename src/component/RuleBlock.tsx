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
              background: "rgba(69,46,125,.15)",
              width: percent(100),
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30, background: "rgba(69,46,125,.1)" }}
            >
              {rule.number}
            </Avatar>
            <Typography variant="h6" color="white">
              {rule.label}
            </Typography>
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
                background: "white",
                width: percent(100),
                borderRadius: 2,
              }}
            >
              <Avatar sx={{ bgcolor: Colors.orange }}>
                <WarningIcon />
              </Avatar>
              <Typography variant="caption" sx={{ color: Colors.orange }}>
                {warning.label}
              </Typography>
            </Box>
          </Grid>
        ))}
    </Grid>
  );
};
