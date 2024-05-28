import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { HeadTitle } from "src/component/HeadTitle";
import { RuleBlock } from "src/component/RuleBlock";

export const HelpPage = () => {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.help.title")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <RuleBlock />
        </Box>
      </Grid>
    </Grid>
  );
};
