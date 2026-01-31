import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { px } from "csx";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FAQBlock } from "src/component/FAQBlock";
import { ModesBlock } from "src/component/ModeBlock";
import { PageBarNavigation } from "src/component/page/PageBarNavigation";
import { RuleBlock } from "src/component/RuleBlock";
import { Colors } from "src/style/Colors";
import { urlYoutube } from "src/utils/config";

export default function HelpPage() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{`${t("pages.help.title")} - ${t("appname")}`}</title>
      </Helmet>
      <PageBarNavigation title={t("pages.help.title")}>
        <Grid container spacing={1}>
          <Grid size={12}>
            <Divider>
              <Typography variant="h4">{t("commun.explainvideo")}</Typography>
            </Divider>
          </Grid>
          <Grid
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 1,
            }}
            size={12}
          >
            <Link
              to={urlYoutube}
              style={{
                textDecoration: "inherit",
              }}
            >
              <Box
                sx={{
                  borderRadius: px(5),
                  p: "2px 10px",
                  backgroundColor: Colors.black,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  cursor: "pointer",
                  border: "1px solid white",
                }}
              >
                <YouTubeIcon fontSize="large" sx={{ color: Colors.red }} />
                <Typography variant="h6" color="text.secondary">
                  {t("commun.linkyt")}
                </Typography>
              </Box>
            </Link>
          </Grid>
          <Grid size={12}>
            <Divider>
              <Typography variant="h4">{t("commun.rules")}</Typography>
            </Divider>
          </Grid>
          <Grid size={12} sx={{ p: 1 }}>
            <RuleBlock
              rules={[
                { label: t("rules.step1") },
                { label: t("rules.step2") },
                { label: t("rules.step3") },
              ]}
            />
          </Grid>
          <Grid size={12}>
            <Divider>
              <Typography variant="h4">{t("commun.modes")}</Typography>
            </Divider>
          </Grid>
          <Grid size={12} sx={{ p: 1 }}>
            <ModesBlock />
          </Grid>
          <Grid size={12}>
            <Divider>
              <Typography variant="h4">{t("commun.faq")}</Typography>
            </Divider>
          </Grid>
          <Grid size={12} sx={{ p: 1 }}>
            <FAQBlock />
          </Grid>
        </Grid>
      </PageBarNavigation>
    </>
  );
}
