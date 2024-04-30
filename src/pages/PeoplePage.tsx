import { Box, Divider, Grid, Typography } from "@mui/material";
import { percent } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { searchProfile } from "src/api/profile";
import { BasicSearchInput } from "src/component/Input";
import { BasicCardProfile } from "src/component/card/CardProfile";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS } from "src/models/Friend";
import { Profile } from "src/models/Profile";

export const PeoplePage = () => {
  const { t } = useTranslation();
  const { friends } = useApp();
  const { profile } = useAuth();

  const [search, setSearch] = useState("");
  const [players, setPlayers] = useState<Array<Profile>>([]);

  useEffect(() => {
    const getPlayers = () => {
      searchProfile(search, []).then(({ data }) => {
        setPlayers(data ? (data as Array<Profile>) : []);
      });
    };
    getPlayers();
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
  const friendsFilter = friendsProfile.filter((el) =>
    el.username.toLocaleLowerCase().includes(search.toLocaleLowerCase())
  );

  const playerFilter = players.filter(
    (el) =>
      el.username.toLocaleLowerCase().includes(search.toLocaleLowerCase()) &&
      !uuidFriends.includes(el.id) &&
      (profile ? el.id !== profile.id : true)
  );

  return (
    <Box sx={{ width: percent(100), p: 1 }}>
      <Helmet>
        <title>{`${t("pages.people.title")} - ${t("appname")}`}</title>
      </Helmet>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <BasicSearchInput
            label={t("commun.search")}
            value={search}
            onChange={setSearch}
            clear={() => setSearch("")}
          />
        </Grid>
        {friendsFilter.length > 0 && (
          <>
            <Grid item xs={12}>
              <Typography variant="h2">{t("commun.myfriends")}</Typography>
            </Grid>
            {friendsFilter.map((friend) => (
              <Grid item xs={4} sm={3} md={2} lg={1} key={friend.id}>
                <BasicCardProfile profile={friend} />
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
        {playerFilter.map((player) => (
          <Grid item xs={4} sm={3} md={2} lg={1} key={player.id}>
            <BasicCardProfile profile={player} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
