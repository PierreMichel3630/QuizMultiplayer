import { Box, Container, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
import { px } from "csx";
import { uniqBy } from "lodash";
import { FavoriteSelectBlock } from "src/component/FavoriteBlock";
import { BasicSearchInput } from "src/component/Input";
import { SkeletonTheme } from "src/component/skeleton/SkeletonTheme";
import { LogoIcon } from "src/icons/LogoIcon";
import { searchString } from "src/utils/string";

export default function PlayPage() {
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
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState<string | null>("duel");
  const [openModalFriend, setOpenModalFriend] = useState(false);
  const [profileAdv, setProfileAdv] = useState<undefined | Profile>(
    location.state ? location.state.opponent : undefined
  );
  const [maxIndex, setMaxIndex] = useState(20);

  const themesFilter = useMemo(() => {
    setIsLoading(false);
    return uniqBy(
      [...themes]
        .filter((el) => searchString(search, el.name[language.iso]))
        .sort((a, b) => sortByName(language, a, b)),
      (el) => el.id
    ).splice(0, maxIndex);
  }, [themes, search, language, maxIndex]);

  useEffect(() => {
    const handleScroll = () => {
      setIsLoading(true);
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 20);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [themes, maxIndex]);

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
      <BarNavigation title={t("pages.play.title")} />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Box sx={{ p: 1, mt: px(140), mb: px(50), position: "relative" }}>
            <Box
              sx={{
                position: "fixed",
                top: 65,
                left: 0,
                right: 0,
                backgroundColor: "white",
                zIndex: 2,
                p: 2,
              }}
            >
              <Container maxWidth="md">
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
                  <Grid item xs={12}>
                    <BasicSearchInput
                      label={t("commun.search")}
                      onChange={(value) => setSearch(value)}
                      value={search}
                      clear={() => setSearch("")}
                    />
                  </Grid>
                </Grid>
              </Container>
            </Box>
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12}>
                <FavoriteSelectBlock
                  select={(t) => setTheme(t)}
                  selected={theme ? [theme.id] : []}
                  search={search}
                />
              </Grid>
              {themesFilter.map((t) => (
                <Grid item key={t.id}>
                  <CardSelectTheme
                    theme={t}
                    select={theme && theme.id === t.id ? true : false}
                    onSelect={() => setTheme(t)}
                  />
                </Grid>
              ))}
              {isLoading && (
                <>
                  {Array.from(new Array(20)).map((_, index) => (
                    <Grid item key={index}>
                      <SkeletonTheme />
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
            <Box
              sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: "white",
              }}
            >
              <Container maxWidth="md">
                <Box sx={{ p: 1 }}>
                  <ButtonColor
                    value={Colors.blue3}
                    label={t("commun.play")}
                    icon={LogoIcon}
                    variant="contained"
                    onClick={play}
                  />
                </Box>
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
}
