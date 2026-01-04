import AddCircleIcon from "@mui/icons-material/AddCircle";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { selectVoteTheme, voteTheme } from "src/api/vote";
import { CardVoteTheme } from "src/component/card/CardVoteTheme";
import { ProposeThemeModal } from "src/component/modal/ProposeThemeModal";
import { GoBackButtonIcon } from "src/component/navigation/GoBackButton";
import { TimeLeftLabel } from "src/component/TimeLeftBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { VoteTheme } from "src/models/Vote";
import { sortByVoteDesc } from "src/utils/sort";

export default function VoteThemePage() {
  const { t } = useTranslation();
  const { user, profile, refreshProfil } = useAuth();
  const { setMessage, setSeverity } = useMessage();
  const navigate = useNavigate();

  const [themes, setThemes] = useState<Array<VoteTheme>>([]);
  const [openModalPropose, setOpenModalPropose] = useState(false);

  const voteDate = useMemo(() => profile?.datevote, [profile]);

  const getVoteTheme = () => {
    selectVoteTheme().then(({ data }) => {
      const res = data ?? [];
      setThemes([...res].sort(sortByVoteDesc));
    });
  };

  useEffect(() => {
    getVoteTheme();
  }, []);

  const onProposeTheme = useCallback(() => {
    if (user) {
      setOpenModalPropose(true);
    } else {
      navigate(`/login`);
    }
  }, [user, navigate]);

  const onCloseModalPropose = () => {
    setOpenModalPropose(false);
    getVoteTheme();
  };

  const vote = useCallback(
    (theme: VoteTheme) => {
      if (user) {
        voteTheme(theme).then(({ error, data }) => {
          if (error || data === false) {
            setSeverity("error");
            setMessage(t("commun.error"));
          } else {
            refreshProfil();
            setSeverity("success");
            setMessage(t("alert.vote"));
            getVoteTheme();
          }
        });
      } else {
        navigate(`/login`);
      }
    },
    [user, setSeverity, setMessage, t, refreshProfil, navigate]
  );

  const isVoteActivate = useMemo(() => {
    if (profile) {
      if (profile.datevote === null) {
        return true;
      } else {
        return moment().diff(moment(profile.datevote), "hours") >= 12;
      }
    } else {
      return true;
    }
  }, [profile]);

  return (
    <Container maxWidth="xs">
      <Grid container>
        <Helmet>
          <title>{`${t("pages.votetheme.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <Box sx={{ p: 1 }}>
            <Grid
              container
              spacing={1}
              alignItems="center"
              justifyContent="center"
            >
              <Grid item>
                <GoBackButtonIcon />
              </Grid>
              <Grid item xs sx={{ textAlign: "center" }}>
                <Typography variant="h2">{t("commun.votetheme")}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption">
                  {t("commun.votethemetext")}
                </Typography>
              </Grid>
              <Grid item>
                <TimeLeftLabel
                  intervalHours={12}
                  lastDate={voteDate}
                  size="large"
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  endIcon={<AddCircleIcon />}
                  color="secondary"
                  onClick={onProposeTheme}
                  sx={{ p: 1, height: "fit-content" }}
                >
                  <Typography variant="h6">
                    {t("commun.proposetheme")}
                  </Typography>
                </Button>
              </Grid>
              {themes.map((theme) => (
                <Grid item xs={12} key={theme.id}>
                  <CardVoteTheme
                    theme={theme}
                    onClick={() => vote(theme)}
                    disabled={!isVoteActivate}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <ProposeThemeModal open={openModalPropose} close={onCloseModalPropose} />
    </Container>
  );
}
