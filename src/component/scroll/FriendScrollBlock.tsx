import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import { useEffect, useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { FRIENDSTATUS } from "src/models/Friend";
import { sortByUsername } from "src/utils/sort";
import { BasicCardFriendProfile } from "../card/CardProfile";
import { FriendNotificationBlock } from "../notification/FriendNotificationBlock";
import { TitleCount } from "../title/TitleCount";
import { useTranslation } from "react-i18next";

interface Props {
  search: string;
}

export const FriendScrollBlock = ({ search }: Props) => {
  const { t } = useTranslation();

  const { friends, getFriends } = useApp();
  const { profile } = useAuth();

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const friendsProfile = useMemo(
    () =>
      friends
        .filter((el) => el.status === FRIENDSTATUS.VALID)
        .map((el) =>
          profile && el.user1.id === profile.id ? el.user2 : el.user1
        ),
    [friends, profile]
  );
  const friendsFilter = useMemo(() => {
    const friends = friendsProfile
      .filter((el) =>
        el.username.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      )
      .sort(sortByUsername);
    return uniqBy(friends, (el) => el.id);
  }, [friendsProfile, search]);

  const invitationsfriends = useMemo(
    () =>
      friends.filter(
        (el) =>
          profile !== null &&
          profile.id === el.user2.id &&
          el.status === FRIENDSTATUS.PROGRESS
      ),
    [friends, profile]
  );

  return (
    <Grid container spacing={1}>
      {invitationsfriends.length > 0 && (
        <>
          <Grid item xs={12}>
            <TitleCount
              title={t("commun.myinvitation")}
              count={invitationsfriends.length}
            />
          </Grid>
          {invitationsfriends.map((friend) => (
            <Grid item xs={12} key={friend.id}>
              <FriendNotificationBlock key={friend.id} friend={friend} />
            </Grid>
          ))}
        </>
      )}

      {friendsFilter.length > 0 && (
        <>
          <Grid item xs={12}>
            <TitleCount
              title={t("commun.myfriends")}
              count={friendsFilter.length}
            />
          </Grid>
          {friendsFilter.map((friend, index) => (
            <Grid item key={index} xs={12}>
              <BasicCardFriendProfile profile={friend} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};
