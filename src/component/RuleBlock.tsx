import { Avatar, Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";

import { Colors } from "src/style/Colors";

export const RuleBlock = () => {
  const { t } = useTranslation();

  const rules = [t("rules.step1"), t("rules.step2"), t("rules.step3")];

  return (
    <Grid container spacing={1}>
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
              backgroundColor: Colors.black,
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30, backgroundColor: Colors.white }}
            >
              <Typography variant="h4" sx={{ color: Colors.black }}>
                {index + 1}
              </Typography>
            </Avatar>
            <Typography variant="h6" color="text.secondary">
              {rule}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
