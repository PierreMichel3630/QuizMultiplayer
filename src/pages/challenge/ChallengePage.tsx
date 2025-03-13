import { Box, Divider, Grid, Typography } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { NeedConnectAlert } from "src/component/alert/ConnectAlert";
import { TitleBlock } from "src/component/title/Title";
import { useAuth } from "src/context/AuthProviderSupabase";

import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  countChallengeGameByDateAndProfileId,
  launchChallenge,
} from "src/api/challenge";
import { ButtonColor } from "src/component/Button";
import { RankingChallenge } from "src/component/RankingChallenge";
import { TimeLeftToNextDayLabel } from "src/component/TimeLeftBlock";
import { Colors } from "src/style/Colors";

export default function ChallengePage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [hasPlayChallenge, setHasPlayChallenge] = useState(false);

  const launch = useCallback(() => {
    if (profile) {
      launchChallenge().then(({ data }) => {
        navigate(`/challenge/${data.uuid}`);
      });
    } else {
      navigate("/login");
    }
  }, [navigate, profile]);

  useEffect(() => {
    const isChallengeAvailable = () => {
      if (profile) {
        const date = moment();
        countChallengeGameByDateAndProfileId(date, profile.id).then(
          ({ count }) => {
            setHasPlayChallenge(count !== null && count > 0);
          }
        );
      }
    };
    isChallengeAvailable();
  }, [profile]);

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.streak.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12}>
        <Box sx={{ p: 2 }}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <TitleBlock title={t("commun.daychallenge")} link="/" />
            </Grid>
            <Grid item xs={12} sx={{ textAlign: "center" }}>
              <Typography>{t("commun.challengeexplain")}</Typography>
              <Typography variant="caption">
                {t("commun.challengeexplain2")}
              </Typography>
            </Grid>
            {!profile && (
              <Grid item xs={12}>
                <NeedConnectAlert />
              </Grid>
            )}
            <Grid item xs={12}>
              {hasPlayChallenge ? (
                <TimeLeftToNextDayLabel label={t("commun.nextdaychallenge")} />
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
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <RankingChallenge hasPlayChallenge={hasPlayChallenge} />
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}
