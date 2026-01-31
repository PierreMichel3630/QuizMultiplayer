import { Box, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { FAQBlock } from "src/component/FAQBlock";
import { HeadTitle } from "src/component/HeadTitle";

export default function FAQPage() {
  const { t } = useTranslation();
  return (
    <Grid container>
      <Grid size={12}>
        <HeadTitle title={t("pages.faq.title")} />
      </Grid>
      <Grid size={12}>
        <Box sx={{ p: 1 }}>
          <FAQBlock />
        </Box>
      </Grid>
    </Grid>
  );
}
