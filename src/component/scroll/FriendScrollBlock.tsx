import { Grid } from "@mui/material";
import { uniqBy } from "lodash";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useRealtime } from "src/context/NotificationProvider";
import { NotificationType } from "src/models/enum/NotificationType";
import { FRIENDSTATUS } from "src/models/Friend";
import { sortByUsername } from "src/utils/sort";
import { BasicCardFriendProfile } from "../card/CardProfile";
import { NotificationBlock } from "../notification/NotificationBlock";
import { TitleCount } from "../title/TitleCount";

interface Props {
  search: string;
}
export const FriendScrollBlock = ({ search }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { friends, getFriends } = useApp();
  const { notifications } = useRealtime();

  useEffect(() => {
    getFriends();
  }, [getFriends]);

  const invitationsfriends = useMemo(
    () =>
      [...notifications].filter(
        (el) =>
          el.isread === false && el.type === NotificationType.friend_request
      ),
    [notifications]
  );

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

  return (
    <Grid container spacing={1}>
      {invitationsfriends.length > 0 && (
        <>
          <Grid size={12}>
            <TitleCount
              title={t("commun.myinvitation")}
              count={invitationsfriends.length}
            />
          </Grid>
          {invitationsfriends.map((friend) => (
            <Grid key={friend.id} size={12}>
              <NotificationBlock notification={friend} />
            </Grid>
          ))}
        </>
      )}
      {friendsFilter.length > 0 && (
        <>
          <Grid size={12}>
            <TitleCount
              title={t("commun.myfriends")}
              count={friendsFilter.length}
            />
          </Grid>
          {friendsFilter.map((friend, index) => (
            <Grid key={index} size={12}>
              <BasicCardFriendProfile profile={friend} />
            </Grid>
          ))}
        </>
      )}
    </Grid>
  );
};
