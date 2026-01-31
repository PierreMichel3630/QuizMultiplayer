import { Box, Divider, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { NeedConnectAlert } from "src/component/alert/ConnectAlert";
import { TitleBlock } from "src/component/title/Title";
import { useAuth } from "src/context/AuthProviderSupabase";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import moment from "moment";
import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { launchChallenge } from "src/api/challenge";
import { updateProfil } from "src/api/profile";
import { ButtonColor } from "src/component/Button";
import { WinnerChallengeBlock } from "src/component/challenge/WinnerChallengeBlock";
import { RankingChallenge } from "src/component/RankingChallenge";
import { TimeLeftToNextDayLabel } from "src/component/TimeLeftBlock";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

export default function ChallengePage() {
  const { t } = useTranslation();
  const { profile, hasPlayChallenge, refreshHasPlayChallenge } = useAuth();
  const { language } = useUser();
  const navigate = useNavigate();

  const launch = useCallback(async () => {
    if (profile && language) {
      const date = moment().format("YYYY-MM-DD");
      launchChallenge(date, language.id).then(async ({ data }) => {
        const newProfile = {
          id: profile.id,
          lastchallengeplay: date,
        };
        await updateProfil(newProfile);
        navigate(`/challenge/${data.uuid}`);
      });
    } else {
      navigate("/login");
    }
  }, [navigate, profile, language]);

  useEffect(() => {
    refreshHasPlayChallenge();
  }, [refreshHasPlayChallenge]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.challenge.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid size={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid size={12}>
              <TitleBlock title={t("commun.daychallenge")} link="/" />
            </Grid>
            <Grid sx={{ textAlign: "center" }} size={12}>
              <Typography>{t("commun.challengeexplain")}</Typography>
              <Typography variant="caption">
                {t("commun.challengeexplain2")}
              </Typography>
            </Grid>
            {profile ? (
              <>
                {hasPlayChallenge !== undefined && (
                  <Grid size={12}>
                    {hasPlayChallenge ? (
                      <TimeLeftToNextDayLabel
                        label={t("commun.nextdaychallenge")}
                      />
                    ) : (
                      <ButtonColor
                        fullWidth
                        value={Colors.blue}
                        label={t("commun.launch")}
                        icon={RocketLaunchIcon}
                        variant="contained"
                        onClick={() => {
                          launch();
                        }}
                      />
                    )}
                  </Grid>
                )}
              </>
            ) : (
              <Grid size={12}>
                <NeedConnectAlert />
              </Grid>
            )}

            <Grid size={12}>
              <Divider sx={{ borderBottomWidth: 5 }} />
            </Grid>
            <Grid size={12}>
              <WinnerChallengeBlock />
            </Grid>
            <Grid size={12}>
              <Divider sx={{ borderBottomWidth: 5 }} />
            </Grid>
            <Grid size={12}>
              <RankingChallenge />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
