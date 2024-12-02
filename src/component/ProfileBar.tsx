import { Badge, Box, Grid, Skeleton, Typography } from "@mui/material";
import { padding, percent, px, viewWidth } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StatAccomplishment } from "src/models/Accomplishment";
import { FRIENDSTATUS } from "src/models/Friend";
import { getLevel } from "src/utils/calcul";
import { AvatarAccountBadge } from "./avatar/AvatarAccount";
import { CountryBlock } from "./CountryBlock";
import { MoneyBlock } from "./MoneyBlock";

import PeopleIcon from "@mui/icons-material/People";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SettingsIcon from "@mui/icons-material/Settings";
import { Colors } from "src/style/Colors";
import { AdminButton } from "./button/AdminButton";
import { SkeletonCircular } from "./skeleton/SkeletonCircular";

export const ProfileBar = () => {
  const navigate = useNavigate();
  const { logout, profile } = useAuth();
  const { friends } = useApp();

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

  const notificationsFriend = useMemo(
    () =>
      friends.filter(
        (el) =>
          el.status === FRIENDSTATUS.PROGRESS &&
          profile &&
          profile.id !== el.user1.id
      ).length,
    [friends, profile]
  );

  useEffect(() => {
    const getMyStat = () => {
      if (profile) {
        selectStatAccomplishmentByProfile(profile.id).then(({ data }) => {
          setStat(data as StatAccomplishment);
        });
      }
    };
    getMyStat();
  }, [profile]);

  const level = useMemo(() => (stat ? getLevel(stat.xp) : undefined), [stat]);

  const disconnect = async () => {
    await logout();
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        width: percent(100),
        p: 1,
      }}
    >
      <Grid container spacing={1}>
        <Grid item>
          {profile ? (
            <AvatarAccountBadge
              avatar={profile.avatar.icon}
              size={60}
              level={level}
              profile={profile}
            />
          ) : (
            <SkeletonCircular size={60} />
          )}
        </Grid>

        <Grid item xs>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: px(2),
            }}
          >
            <Box sx={{ maxWidth: viewWidth(60) }}>
              <Link to={`/myprofile`} style={{ textDecoration: "none" }}>
                {profile ? (
                  <Typography
                    variant="h4"
                    color="text.secondary"
                    sx={{
                      overflow: "hidden",
                      display: "block",
                      lineClamp: 1,
                      boxOrient: "vertical",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {profile.username}
                  </Typography>
                ) : (
                  <Skeleton animation="wave" width={200} height={20} />
                )}
              </Link>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                {profile ? (
                  <>
                    {profile.country && (
                      <Link
                        to={`/personalized`}
                        style={{ textDecoration: "none" }}
                      >
                        <CountryBlock
                          country={profile.country}
                          color="text.secondary"
                          size={18}
                        />
                      </Link>
                    )}
                  </>
                ) : (
                  <Skeleton animation="wave" width={90} />
                )}
                {profile ? (
                  <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                    <Link
                      to={`/personalized`}
                      style={{ textDecoration: "none" }}
                    >
                      <MoneyBlock money={profile.money} variant="body1" />
                    </Link>
                  </Box>
                ) : (
                  <Skeleton animation="wave" width={90} />
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 1 }}>
                <AdminButton />
                <Link to={`/people`}>
                  <Badge badgeContent={notificationsFriend} color="error">
                    <Box
                      sx={{
                        p: padding(2, 8),
                        border: "2px solid",
                        borderColor: Colors.white,
                        borderRadius: px(5),
                        display: "flex",
                      }}
                    >
                      <PeopleIcon sx={{ color: Colors.white }} />
                    </Box>
                  </Badge>
                </Link>
                <Link to={`/parameter`}>
                  <Box
                    sx={{
                      p: padding(2, 8),
                      border: "2px solid",
                      borderColor: Colors.white,
                      borderRadius: px(5),
                      display: "flex",
                    }}
                  >
                    <SettingsIcon sx={{ color: Colors.white }} />
                  </Box>
                </Link>
                <Box
                  sx={{
                    p: padding(2, 8),
                    border: "2px solid",
                    borderColor: Colors.white,
                    borderRadius: px(5),
                    display: "flex",
                    cursor: "pointer",
                  }}
                  onClick={disconnect}
                >
                  <PowerSettingsNewIcon sx={{ color: Colors.white }} />
                </Box>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};
