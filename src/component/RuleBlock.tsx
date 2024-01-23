import { Avatar, Box, Grid, Paper, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";

export const RuleBlock = () => {
  const { t } = useTranslation();
  const rules = [
    { number: 1, label: t("rules.step1") },
    { number: 2, label: t("rules.step2") },
    { number: 3, label: t("rules.step3") },
  ];
  return (
    <Paper
      sx={{
        display: "flex",
        background: "rgba(69,46,125,.15)",
        width: percent(100),
      }}
    >
      <Grid container spacing={1}>
        {rules.map((rule, index) => (
          <Grid item xs key={index}>
            <Box sx={{ p: 1, display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar
                sx={{ width: 56, height: 56, background: "rgba(69,46,125,.1)" }}
              >
                {rule.number}
              </Avatar>
              <Typography variant="h4" color="white">
                {rule.label}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};
