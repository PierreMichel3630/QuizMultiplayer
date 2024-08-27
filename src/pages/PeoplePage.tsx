import { Box, Container, Divider, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { searchProfilePagination } from "src/api/profile";
import { BasicSearchInput } from "src/component/Input";
import {
  BasicCardFriendProfile,
  BasicCardProfile,
} from "src/component/card/CardProfile";
import { SkeletonPlayers } from "src/component/skeleton/SkeletonPlayer";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

export default function PeoplePage() {
  const { t } = useTranslation();
  const { friends } = useApp();
  const { profile } = useAuth();

  const ITEMPERPAGE = 25;

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Array<Profile>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const getPlayers = () => {
      if (!isEnd) {
        setIsLoading(true);
        searchProfilePagination(search, [], page, ITEMPERPAGE).then(
          ({ data }) => {
            const result = data as Array<Profile>;
            setPlayers((prev) => [...prev, ...result]);
            setIsLoading(false);
            setIsEnd(result.length === 0);
          }
        );
      }
    };
    if (search !== "") {
      const timer = setTimeout(() => {
        getPlayers();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      getPlayers();
    }
  }, [search, page, isEnd]);

  useEffect(() => {
    setPage(0);
    setPlayers([]);
    setIsLoading(true);
    setIsEnd(false);
  }, [search]);

  const friendsProfile = useMemo(
    () =>
      friends
        .filter((el) => el.status === FRIENDSTATUS.VALID)
        .map((el) =>
          profile && el.user1.id === profile.id ? el.user2 : el.user1
        ),
    [friends, profile]
  );
  const uuidFriends = useMemo(
    () => friendsProfile.map((el) => el.id),
    [friendsProfile]
  );
  const friendsFilter = useMemo(() => {
    const friends = friendsProfile.filter((el) =>
      el.username.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );
    return uniqBy(friends, (el) => el.id);
  }, [friendsProfile, search]);

  const playerFilter = useMemo(() => {
    const res = players.filter(
      (el) =>
        el.username.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
        !uuidFriends.includes(el.id) &&
        (profile ? el.id !== profile.id : true)
    );
    return uniqBy(res, (el) => el.id);
  }, [players, profile, search, uuidFriends]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        isEnd ||
        isLoading ||
        window.innerHeight + document.documentElement.scrollTop + 250 <=
          document.documentElement.offsetHeight
      ) {
        return;
      } else {
        setPage((prev) => prev + 1);
      }
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd, isLoading, page]);

  return (
    <Box sx={{ width: percent(100) }}>
      <Helmet>
        <title>{`${t("pages.people.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Box
        sx={{
          position: "sticky",
          top: 56,
          zIndex: 3,
          p: 1,
          width: percent(100),
          backgroundColor: Colors.white,
        }}
      >
        <Container maxWidth="lg">
          <BasicSearchInput
            label={t("commun.search")}
            value={search}
            onChange={setSearch}
            clear={() => setSearch("")}
          />
        </Container>
      </Box>
      <Box sx={{ width: percent(100), p: 1 }}>
        <Grid container spacing={1} sx={{ position: "relative" }}>
          {friendsFilter.length > 0 && (
            <>
              <Grid item xs={12}>
                <Typography variant="h2">{t("commun.myfriends")}</Typography>
              </Grid>
              {friendsFilter.map((friend, index) => (
                <Grid item key={index} xs={12}>
                  <BasicCardFriendProfile profile={friend} />
                </Grid>
              ))}
              <Grid item xs={12}>
                <Divider sx={{ borderBottomWidth: 3 }} />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h2">{t("commun.players")}</Typography>
              </Grid>
            </>
          )}
          {playerFilter.map((player, index) => (
            <Grid item key={index} xs={12}>
              <BasicCardProfile profile={player} />
            </Grid>
          ))}
          {isLoading && <SkeletonPlayers number={ITEMPERPAGE} />}
        </Grid>
      </Box>
    </Box>
  );
}
