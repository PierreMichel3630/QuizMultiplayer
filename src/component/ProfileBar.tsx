import { Box, Skeleton, Typography } from "@mui/material";
import { important, padding, percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { selectStatAccomplishmentByProfile } from "src/api/accomplishment";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StatAccomplishment } from "src/models/Accomplishment";
import { getLevel } from "src/utils/calcul";
import { AvatarAccountBadge } from "./avatar/AvatarAccount";
import { CountryImageBlock } from "./CountryBlock";
import { MoneyArrondieBlock } from "./MoneyBlock";

import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import SettingsIcon from "@mui/icons-material/Settings";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";
import { AdminButton } from "./button/AdminButton";
import { NotificationBadge } from "./button/NotificationBadge";
import { SkeletonCircular } from "./skeleton/SkeletonCircular";
import { StreakBlock } from "./StreakBlock";

export const ProfileBar = () => {
  const navigate = useNavigate();
  const { logout, profile, streak } = useAuth();
  const { language } = useUser();

  const [stat, setStat] = useState<StatAccomplishment | undefined>(undefined);

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
        p: px(5),
        gap: 1,
      }}
    >
      {profile ? (
        <Link to={`/personalized`} style={{ textDecoration: "none" }}>
          <AvatarAccountBadge
            avatar={profile.avatar.icon}
            size={60}
            level={level}
            profile={profile}
            color={Colors.blue4}
          />
        </Link>
      ) : (
        <SkeletonCircular size={60} />
      )}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: px(2),
          minWidth: 0,
          width: percent(100),
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            {profile?.country && (
              <Link to={`/personalized`} style={{ textDecoration: "none" }}>
                <CountryImageBlock country={profile.country} size={30} />
              </Link>
            )}
            <Link
              to={profile ? `/profil/${profile.id}` : "/login"}
              style={{ textDecoration: "none", maxWidth: "calc(100% -30px)" }}
            >
              {profile ? (
                <Typography
                  variant="h2"
                  color="text.secondary"
                  sx={{
                    overflow: "hidden",
                    display: "block",
                    lineClamp: 1,
                    boxOrient: "vertical",
                    textOverflow: "ellipsis",
                    fontSize: important(px(20)),
                  }}
                >
                  {profile.username}
                </Typography>
              ) : (
                <Skeleton animation="wave" width={200} height={20} />
              )}
            </Link>
          </Box>
          {streak !== undefined && <StreakBlock value={streak} />}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              minWidth: 0,
            }}
          >
            {profile ? (
              <Box sx={{ display: "flex", justifyContent: "flex-start" }}>
                <Link to={`/shop`} style={{ textDecoration: "none" }}>
                  <MoneyArrondieBlock
                    money={profile.money}
                    language={language}
                    variant="h4"
                    width={22}
                  />
                </Link>
              </Box>
            ) : (
              <Skeleton animation="wave" width={90} />
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <AdminButton />
            <Link to={`/parameters`}>
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
            <Link to={`/notifications`}>
              <NotificationBadge />
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
    </Box>
  );
};
