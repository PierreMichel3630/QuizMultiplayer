import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { HeadTitle } from "src/component/HeadTitle";
import { ModesBlock } from "src/component/ModeBlock";
import { RuleBlock } from "src/component/RuleBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";
import WarningIcon from "@mui/icons-material/Warning";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Link } from "react-router-dom";

export const urlYoutube = "https://www.youtube.com/@QuizBattleofficial";

export default function HelpPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const warnings = [t("warning.warning1")];

  return (
    <Grid container>
      <Grid item xs={12}>
        <HeadTitle title={t("pages.help.title")} />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="h4">{t("commun.explainvideo")}</Typography>
              </Divider>
            </Grid>
            <Grid
              item
              xs={12}
              sx={{
                display: "flex",
                justifyContent: "center",
              }}
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
            <Grid item xs={12}>
              <Divider>
                <Typography variant="h4">{t("commun.rules")}</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <RuleBlock
                rules={[
                  { label: t("rules.step1") },
                  { label: t("rules.step2") },
                  { label: t("rules.step3") },
                ]}
              />
            </Grid>
            <Grid item xs={12}>
              <Divider>
                <Typography variant="h4">{t("commun.modes")}</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <ModesBlock />
            </Grid>

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
        </Box>
      </Grid>
    </Grid>
  );
}
