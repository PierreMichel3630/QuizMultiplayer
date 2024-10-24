import { Avatar, Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Badge } from "src/models/Badge";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { percent, px } from "csx";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";
import { sortByUnlock } from "src/utils/sort";
import { MoneyBlock } from "./MoneyBlock";
import { useTranslation } from "react-i18next";

interface Props {
  onSelect: (value: Badge) => void;
}

export const BadgeSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { badges, mybadges } = useApp();
  const { t } = useTranslation();

  const badgesVerify = useMemo(() => {
    const idUnlock = mybadges.map((el) => el.id);
    return [...badges]
      .map((badge) => ({
        ...badge,
        unlock:
          badge.isaccomplishment || badge.price > 0
            ? idUnlock.includes(badge.id)
            : true,
      }))
      .sort(sortByUnlock);
  }, [mybadges, badges]);

  const badgesUnlock = useMemo(
    () => [...badgesVerify].filter((el) => el.unlock),
    [badgesVerify]
  );

  const badgesLock = useMemo(
    () => [...badgesVerify].filter((el) => !el.unlock),
    [badgesVerify]
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container spacing={1} justifyContent="center">
          {badgesUnlock.map((badge) => {
            const isSelect =
              profile && profile.badge && profile.badge.id === badge.id;

            return (
              <Grid item key={badge.id}>
                <Box sx={{ position: "relative" }}>
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
                      width: 70,
                      height: 70,
                    }}
                    src={badge.icon}
                    onClick={() => onSelect(badge)}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1} justifyContent="center">
          {badgesLock.map((badge) => {
            return (
              <Grid item key={badge.id}>
                <Box sx={{ position: "relative" }}>
                  <Link
                    to={`/badge/${badge.id}`}
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
                        width: 70,
                        height: 70,
                      }}
                      src={badge.icon}
                    />
                    {badge.price > 0 ? (
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
                        <MoneyBlock money={badge.price} variant="h6" />
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
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
