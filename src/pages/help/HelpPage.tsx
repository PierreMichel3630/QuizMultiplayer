import { Avatar, Box, Divider, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useTranslation } from "react-i18next";
import { HeadTitle } from "src/component/HeadTitle";
import { ModesBlock } from "src/component/ModeBlock";
import { RuleBlock } from "src/component/RuleBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";
import WarningIcon from "@mui/icons-material/Warning";

export const HelpPage = () => {
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
                <Typography variant="h4">{t("commun.rules")}</Typography>
              </Divider>
            </Grid>
            <Grid item xs={12}>
              <RuleBlock />
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
};
