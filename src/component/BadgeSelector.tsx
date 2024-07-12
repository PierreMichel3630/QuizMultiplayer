import { Avatar, Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Badge } from "src/models/Badge";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { percent, viewHeight } from "csx";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";
import { sortByUnlock } from "src/utils/sort";

interface Props {
  onSelect: (value: Badge) => void;
}

export const BadgeSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { badges, mybadges } = useApp();

  const badgesUnlock = useMemo(() => {
    const idUnlock = mybadges.map((el) => el.id);
    return [...badges]
      .map((badge) => ({
        ...badge,
        unlock: idUnlock.includes(badge.id),
      }))
      .sort(sortByUnlock);
  }, [mybadges, badges]);

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      sx={{ maxHeight: viewHeight(20), overflowX: "scroll" }}
    >
      {badgesUnlock.map((badge) => {
        const isSelect =
          profile && profile.badge && profile.badge.id === badge.id;

        return (
          <Grid item key={badge.id}>
            <Box sx={{ position: "relative" }}>
              {badge.unlock ? (
                <>
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
                </>
              ) : (
                <Link to={`/badge/${badge.id}`}>
                  <Avatar
                    sx={{
                      width: 70,
                      height: 70,
                      opacity: 0.85,
                    }}
                    src={badge.icon}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: percent(50),
                      left: percent(50),
                      transform: "translate(-50%, -50%)",
                    }}
                  >
                    <LockTwoToneIcon
                      sx={{
                        fontSize: 40,
                        color: Colors.grey4,
                      }}
                    />
                  </Box>
                </Link>
              )}
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};
