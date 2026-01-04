import { Avatar, Box, Grid } from "@mui/material";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Badge } from "src/models/Badge";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { percent } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  onSelect: (value: Badge) => void;
}

export const BadgeSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { myBadges } = useApp();

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <Grid container spacing={1} alignItems="center" justifyContent="center">
          {myBadges.map((badge) => {
            const isSelect = profile?.badge && profile.badge.id === badge.id;

            return (
              <Grid key={badge.id}>
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
                      width: 60,
                      height: 60,
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
    </Grid>
  );
};
