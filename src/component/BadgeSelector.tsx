import { Avatar, Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Badge } from "src/models/Badge";

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
  const { badges, mybadges, accomplishments } = useApp();

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
        const accomplishment = accomplishments.find(
          (el) => el.badge && el.badge.id === badge.id
        );
        return (
          <Grid item key={badge.id}>
            <Box sx={{ position: "relative" }}>
              {badge.unlock ? (
                <Avatar
                  sx={{
                    cursor: "pointer",
                    border: isSelect
                      ? `5px solid ${Colors.green}`
                      : `5px solid ${Colors.white}`,
                    width: 60,
                    height: 60,
                  }}
                  src={badge.icon}
                  onClick={() => onSelect(badge)}
                />
              ) : (
                <Link
                  to={`/accomplishments${
                    accomplishment ? `#${accomplishment.id}` : ""
                  }`}
                >
                  <Avatar
                    sx={{
                      border: `5px solid ${Colors.black}`,
                      width: 60,
                      height: 60,
                      opacity: 0.5,
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
                        fontSize: 30,
                        color: Colors.black,
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
