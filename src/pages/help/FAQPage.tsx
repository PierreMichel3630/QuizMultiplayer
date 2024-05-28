import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FAQBlock } from "src/component/FAQBlock";
import { HeadTitle } from "src/component/HeadTitle";

export const FAQPage = () => {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.faq.title")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <FAQBlock />
        </Box>
      </Grid>
    </Grid>
  );
};
