import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { t } from "i18next";
import { deleteFriendById, insertFriend } from "src/api/friend";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { FRIENDSTATUS, FriendInsert } from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "./Button";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import MailIcon from "@mui/icons-material/Mail";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  profile: Profile;
  small?: boolean;
}

export const FriendButton = ({ profile, small = false }: Props) => {
  const { user } = useAuth();
  const { friends, getFriends } = useApp();
  const { setMessage, setSeverity } = useMessage();
  const navigate = useNavigate();

  const friend = useMemo(
    () =>
      friends.find(
        (el) =>
          user &&
          ((el.user1.id === user.id && el.user2.id === profile.id) ||
            (el.user2.id === user.id && el.user1.id === profile.id))
      ),
    [friends, profile.id, user]
  );

  const deleteFriend = () => {
    const friend = friends.find(
      (el) =>
        el.status === FRIENDSTATUS.VALID &&
        (el.user1.id === profile.id || el.user2.id === profile.id)
    );
    if (friend) {
      deleteFriendById(friend.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setSeverity("success");
          setMessage(t("alert.deletefriend"));
          getFriends();
        }
      });
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const addToFriend = () => {
    if (user !== null) {
      const invitation: FriendInsert = {
        user1: user.id,
        user2: profile.id,
      };
      insertFriend(invitation).then(({ error }) => {
        if (error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setSeverity("success");
          setMessage(t("alert.sendfriendrequest"));
          getFriends();
        }
      });
    } else {
      navigate(`/login`);
    }
  };

  return user && friend ? (
    friend.status === FRIENDSTATUS.PROGRESS ? (
      <>
        {user.id === friend.user2.id ? (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.purple,
              p: 1,
              borderRadius: px(5),
            }}
          >
            <MailIcon sx={{ color: Colors.white }} fontSize="small" />
            <Typography variant="body1" color="text.secondary">
              {t("commun.waitvalidation")}
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.purple,
              p: 1,
              borderRadius: px(5),
            }}
          >
            <MailIcon sx={{ color: Colors.white }} fontSize="small" />
            <Typography variant="body1" color="text.secondary">
              {t("commun.waitinvitation")}
            </Typography>
          </Box>
        )}
      </>
    ) : (
      <ButtonColor
        fullWidth={!small}
        value={Colors.red}
        label={t("commun.deletefriend")}
        icon={RemoveCircleIcon}
        variant="contained"
        onClick={(ev) => {
          ev.preventDefault();
          ev.stopPropagation();
          deleteFriend();
        }}
        typography={small ? "body1" : undefined}
        iconSize={small ? 15 : undefined}
      />
    )
  ) : (
    <ButtonColor
      fullWidth={!small}
      value={Colors.green}
      label={t("commun.addtofriend")}
      icon={AddCircleIcon}
      variant="contained"
      onClick={(ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        addToFriend();
      }}
      typography={small ? "body1" : undefined}
      iconSize={small ? 15 : undefined}
    />
  );
};
