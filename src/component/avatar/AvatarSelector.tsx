import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Avatar, Grid } from "@mui/material";
import { percent } from "csx";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Avatar as AvatarInterface } from "src/models/Avatar";
import { Colors } from "src/style/Colors";
import { sortByUnlock } from "src/utils/sort";
import { SkeletonCirculars } from "../skeleton/SkeletonCircular";

interface Props {
  onSelect: (value: AvatarInterface) => void;
}

export const AvatarSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { avatars, myavatars } = useApp();

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

  return (
    <Grid container>
      {avatarsUnlock.length === 0 && (
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
