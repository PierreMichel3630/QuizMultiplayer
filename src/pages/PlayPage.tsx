import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ButtonColor, ButtonColorSelect } from "src/component/Button";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { CardThemeHorizontal } from "src/component/card/CardTheme";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { useUser } from "src/context/UserProvider";
import { Profile } from "src/models/Profile";

import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import {
  launchDuelGame,
  launchSoloGame,
  matchmakingDuelGame,
} from "src/api/game";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { Colors } from "src/style/Colors";

import { BasicSearchInput } from "src/component/Input";
import { DuelButton, SoloButton } from "src/component/button/PlayButton";
import { ICardImage } from "src/component/card/CardImage";
import { SearchThemeSelectScrollBlock } from "src/component/scroll/SearchThemeScrollBlock";
import { LogoIcon } from "src/icons/LogoIcon";

export default function PlayPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { uuid, language } = useUser();
  const { user } = useAuth();
  const { setMessage, setSeverity } = useMessage();

  const [theme, setTheme] = useState<ICardImage | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<string | null>(null);
  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [profileAdv, setProfileAdv] = useState<undefined | Profile>(
    location.state ? location.state.opponent : undefined
  );

  const play = () => {
    if (language) {
      if (theme && mode === "solo" && language) {
        launchSoloGame(uuid, theme.id, language).then(({ data }) => {
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
          matchmakingDuelGame(uuid, theme.id, language).then(({ data }) => {
            if (data) navigate(`/duel/${data.uuid}`);
          });
        } else {
          navigate(`/login`);
        }
      } else {
        setSeverity("error");
        setMessage(t("error.selectatleast1theme"));
      }
    }
  };

  return (
    <Grid container>
      <Helmet>
        <title>{`${t("pages.play.title")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation title={t("pages.play.title")} />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Box sx={{ p: 1 }}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12}>
                <Divider sx={{ borderBottomWidth: 5 }} />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="h4">{t("commun.selecttheme")}</Typography>
              </Grid>
              {theme ? (
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <CardThemeHorizontal
                    theme={theme}
                    onChange={() => setTheme(undefined)}
                  />
                </Grid>
              ) : (
                <>
                  <Grid item xs={12}>
                    <BasicSearchInput
                      label={t("commun.search")}
                      onChange={(value) => setSearch(value)}
                      value={search}
                      clear={() => setSearch("")}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <SearchThemeSelectScrollBlock
                      search={search}
                      onSelect={(value) => setTheme(value)}
                    />
                  </Grid>
                </>
              )}
              {theme && (
                <>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h4">
                      {t("commun.selectgamemode")}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <ButtonColorSelect select={mode === "duel"}>
                      <DuelButton play={() => setMode("duel")} />
                    </ButtonColorSelect>
                  </Grid>
                  <Grid item xs={6}>
                    <ButtonColorSelect select={mode === "solo"}>
                      <SoloButton play={() => setMode("solo")} />
                    </ButtonColorSelect>
                  </Grid>
                </>
              )}
              {theme && mode === "duel" && (
                <>
                  <Grid item xs={12}>
                    <Divider sx={{ borderBottomWidth: 5 }} />
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: "center" }}>
                    <Typography variant="h4">
                      {t("commun.selectopponent")}
                    </Typography>
                    {profileAdv === undefined && (
                      <Typography variant="caption">
                        {t("commun.selectopponenttext")}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <SelectorProfileBlock
                      label={t("commun.selectopponent")}
                      profile={profileAdv}
                      onDelete={() => setProfileAdv(undefined)}
                      onChange={() => setOpenModalFriend(true)}
                    />
                  </Grid>
                </>
              )}
              {theme && mode && (
                <Box
                  sx={{
                    position: "fixed",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    backgroundColor: "background.paper",
                  }}
                >
                  <Container maxWidth="md">
                    <Box sx={{ p: 1 }}>
                      <ButtonColor
                        value={Colors.colorApp}
                        label={t("commun.launchgame")}
                        icon={LogoIcon}
                        variant="contained"
                        onClick={play}
                      />
                    </Box>
                  </Container>
                </Box>
              )}
            </Grid>
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
}
