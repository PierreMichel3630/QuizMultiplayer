import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Avatar, Box, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Avatar as AvatarInterface } from "src/models/Avatar";
import { Colors } from "src/style/Colors";
import { sortByUnlock } from "src/utils/sort";
import { MoneyBlock } from "../MoneyBlock";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { useTranslation } from "react-i18next";
import { SkeletonCirculars } from "../skeleton/SkeletonCircular";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

interface Props {
  onSelect: (value: AvatarInterface) => void;
}

export const AvatarSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { avatars, myavatars } = useApp();
  const { t } = useTranslation();

  const avatarsVerify = useMemo(() => {
    const idUnlock = myavatars.map((el) => el.id);
    return [...avatars]
      .map((avatar) => ({
        ...avatar,
        unlock:
          avatar.isaccomplishment || avatar.price > 0
            ? idUnlock.includes(avatar.id)
            : true,
      }))
      .sort(sortByUnlock);
  }, [myavatars, avatars]);

  const avatarsUnlock = useMemo(
    () => [...avatarsVerify].filter((el) => el.unlock),
    [avatarsVerify]
  );

  const avatarsLock = useMemo(
    () => [...avatarsVerify].filter((el) => !el.unlock),
    [avatarsVerify]
  );

  return (
    <Grid container>
      {avatarsUnlock.length === 0 && avatarsLock.length === 0 && (
        <Grid item xs={12}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            <SkeletonCirculars number={8} size={60} />
          </Grid>
        </Grid>
      )}
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          {avatarsUnlock.map((avatar) => {
            const isSelect = profile && profile.avatar.id === avatar.id;
            return (
              <Grid item key={avatar.id} sx={{ position: "relative" }}>
                {isSelect && (
                  <CheckCircleTwoToneIcon
                    sx={{
                      color: Colors.green2,
                      position: "absolute",
                      backgroundColor: "white",
                      borderRadius: percent(50),
                      top: 0,
                      right: 0,
                      transform: "translate(0%, 0%)",
                      zIndex: 2,
                    }}
                  />
                )}
                <Avatar
                  sx={{
                    cursor: "pointer",
                    width: 60,
                    height: 60,
                  }}
                  src={avatar.icon}
                  onClick={() => onSelect(avatar)}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          {avatarsLock.map((avatar) => {
            return (
              <Grid item key={avatar.id} sx={{ position: "relative" }}>
                <Link
                  to={`/avatar/${avatar.id}`}
                  style={{
                    textDecoration: "none",
                    display: "flex",
                    flexDirection: "column",
                    gap: px(3),
                    alignItems: "center",
                  }}
                >
                  <Avatar
                    sx={{
                      cursor: "pointer",
                      width: 60,
                      height: 60,
                    }}
                    src={avatar.icon}
                  />
                  {avatar.price > 0 ? (
                    <Box
                      sx={{
                        backgroundColor: Colors.grey4,
                        p: "2px 5px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: px(5),
                      }}
                    >
                      <MoneyBlock money={avatar.price} variant="h6" />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        backgroundColor: Colors.grey4,
                        p: px(2),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: px(5),
                        maxWidth: px(80),
                      }}
                    >
                      <LockTwoToneIcon
                        sx={{
                          fontSize: 20,
                          color: Colors.black,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {t("commun.unlockaccomplishments")}
                      </Typography>
                    </Box>
                  )}
                </Link>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};

interface PropsLogin {
  avatars: Array<AvatarInterface>;
  avatar: number;
  onSelect: (value: AvatarInterface) => void;
}

export const AvatarLoginSelector = ({
  avatars,
  avatar,
  onSelect,
}: PropsLogin) => {
  return (
    <Grid container spacing={1} alignItems="center" justifyContent="center">
      {avatars.map((el) => {
        const isSelect = avatar === el.id;
        const color = isSelect ? Colors.green2 : "transparent";
        return (
          <Grid item key={el.id} sx={{ position: "relative" }}>
            {isSelect && (
              <CheckCircleOutlineIcon
                sx={{
                  color: Colors.green2,
                  position: "absolute",
                  backgroundColor: "white",
                  borderRadius: percent(50),
                  top: 0,
                  right: 0,
                  transform: "translate(0%, 0%)",
                  zIndex: 2,
                }}
              />
            )}
            <Avatar
              sx={{
                cursor: "pointer",
                width: 60,
                height: 60,
                border: `3px solid ${color}`,
              }}
              src={el.icon}
              onClick={() => onSelect(el)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
