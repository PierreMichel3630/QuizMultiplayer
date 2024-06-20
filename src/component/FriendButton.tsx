import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { t } from "i18next";
import { deleteFriendById, insertFriend, updateFriend } from "src/api/friend";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import {
  FRIENDSTATUS,
  Friend,
  FriendInsert,
  FriendUpdate,
} from "src/models/Friend";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "./Button";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
interface Props {
  profile: Profile;
  small?: boolean;
}

export const FriendButton = ({ profile, small = false }: Props) => {
  const { user } = useAuth();
  const { friends, refreshFriends } = useApp();
  const { setMessage, setSeverity } = useMessage();
  const navigate = useNavigate();

  const friend = friends.find(
    (el) =>
      user &&
      ((el.user1.id === user.id && el.user2.id === profile.id) ||
        (el.user2.id === user.id && el.user1.id === profile.id))
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
          refreshFriends();
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
          refreshFriends();
        }
      });
    } else {
      navigate(`/login`);
    }
  };

  const confirmFriend = (friend: Friend, status: FRIENDSTATUS) => {
    const value: FriendUpdate = {
      id: friend.id,
      status: status,
    };
    updateFriend(value).then(({ error }) => {
      if (error) {
        setSeverity("error");
        setMessage(t("commun.error"));
      } else {
        setSeverity("success");
        setMessage(
          status === FRIENDSTATUS.VALID
            ? t("alert.validatefriendrequest")
            : t("alert.refusefriendrequest")
        );
        refreshFriends();
      }
    });
  };

  useEffect(() => {
    refreshFriends();
  }, []);

  return user && friend ? (
    friend.status === FRIENDSTATUS.PROGRESS ? (
      <>
        {user.id === friend.user2.id ? (
          <Box
            sx={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: px(5),
              borderRadius: 1,
              gap: 2,
            }}
          >
            <Typography variant="h4" color="text.secondary">
              {t("commun.waitinvitation")}
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Box
                sx={{
                  p: px(5),
                  backgroundColor: Colors.green2,
                  borderRadius: px(5),
                  cursor: "pointer",
                }}
                onClick={() => confirmFriend(friend, FRIENDSTATUS.VALID)}
              >
                <CheckIcon sx={{ color: Colors.white }} />
              </Box>
              <Box
                sx={{
                  p: px(5),
                  backgroundColor: Colors.red2,
                  borderRadius: px(5),
                  cursor: "pointer",
                }}
                onClick={() => confirmFriend(friend, FRIENDSTATUS.REFUSE)}
              >
                <CloseIcon sx={{ color: Colors.white }} />
              </Box>
            </Box>
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
