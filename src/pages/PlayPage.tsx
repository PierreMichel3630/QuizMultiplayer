import { Box, Container, Grid } from "@mui/material";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonColor, ButtonColorSelect } from "src/component/Button";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { CardSelectTheme } from "src/component/card/CardTheme";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Profile } from "src/models/Profile";
import { sortByName } from "src/utils/sort";

import BoltIcon from "@mui/icons-material/Bolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  launchDuelGame,
  launchSoloGame,
  matchmakingDuelGame,
} from "src/api/game";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";

import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import { uniqBy } from "lodash";

export const PlayPage = () => {
  const { t } = useTranslation();
  const { language } = useUser();
  const { themes } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const { uuid } = useUser();
  const { user } = useAuth();
  const { setMessage, setSeverity } = useMessage();

  const [theme, setTheme] = useState<Theme | undefined>(
    location.state ? location.state.theme : undefined
  );
  const [mode, setMode] = useState<string | null>("duel");
  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [profileAdv, setProfileAdv] = useState<undefined | Profile>(
    location.state ? location.state.opponent : undefined
  );

  const themesFilter = useMemo(
    () =>
      uniqBy(themes, (el) => el.id).sort((a, b) => sortByName(language, a, b)),
    [themes, language]
  );

  const play = () => {
    if (theme && mode === "solo") {
      launchSoloGame(uuid, theme.id).then(({ data }) => {
        navigate(`/solo/${data.uuid}`);
      });
    } else if (theme && mode === "duel" && profileAdv !== undefined) {
      if (user) {
        launchDuelGame(uuid, profileAdv.id, theme.id).then(({ data }) => {
          if (data) navigate(`/duel/${data.uuid}`);
        });
      } else {
        navigate(`/login`);
      }
    } else if (theme && mode === "duel" && profileAdv === undefined) {
      if (user) {
        matchmakingDuelGame(uuid, theme.id).then(({ data }) => {
          if (data) navigate(`/duel/${data.uuid}`);
        });
      } else {
        navigate(`/login`);
      }
    } else {
      setSeverity("error");
      setMessage(t("error.selectatleast1theme"));
    }
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid item xs={12} sx={{ backgroundColor: Colors.red }}>
        <BarNavigation title="Jouer" />
      </Grid>
      <Grid item xs={12}>
        <Container maxWidth="lg">
          <Box sx={{ p: 1, position: "relative" }}>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={6}>
                <ButtonColorSelect
                  select={mode === "duel"}
                  value={Colors.red}
                  label={t("commun.duel")}
                  icon={OfflineBoltIcon}
                  onClick={() => setMode("duel")}
                  variant="contained"
                />
              </Grid>
              <Grid item xs={6}>
                <ButtonColorSelect
                  select={mode === "solo"}
                  value={Colors.blue2}
                  label={t("commun.solo")}
                  icon={PlayCircleIcon}
                  onClick={() => setMode("solo")}
                  variant="contained"
                />
              </Grid>
              {mode === "duel" && (
                <Grid item xs={12}>
                  <SelectorProfileBlock
                    label={t("commun.selectadv")}
                    profile={profileAdv}
                    onDelete={() => setProfileAdv(undefined)}
                    onChange={() => setOpenModalFriend(true)}
                  />
                </Grid>
              )}
              {themesFilter.map((t) => (
                <Grid item xs={3} sm={2} md={2} lg={1} key={t.id}>
                  <CardSelectTheme
                    theme={t}
                    select={theme && theme.id === t.id ? true : false}
                    onSelect={() => setTheme(t)}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{
                position: "fixed",
                bottom: 10,
                left: 5,
                right: 5,
              }}
            >
              <Container maxWidth="lg">
                <ButtonColor
                  value={Colors.red}
                  label={t("commun.play")}
                  icon={BoltIcon}
                  variant="contained"
                  onClick={play}
                />
              </Container>
            </Box>
          </Box>
        </Container>
      </Grid>
      <SelectFriendModal
        open={openModalFriend}
        close={() => setOpenModalFriend(false)}
        onValid={(profile) => {
          setProfileAdv(profile);
          setOpenModalFriend(false);
        }}
      />
    </Grid>
  );
};
