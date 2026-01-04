import { Box, Grid } from "@mui/material";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { percent, px } from "csx";
import { Banner } from "src/models/Banner";
import { Colors } from "src/style/Colors";

interface Props {
  onSelect: (value: Banner | null) => void;
}

export const BannerSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { mybanners } = useApp();

  const MAXHEIGHT = 80;

  return (
    <Grid container spacing={1}>
      <Grid
        size={{
          xs: 6,
          sm: 4,
          md: 3
        }}>
        <Box
          sx={{
            width: percent(100),
            height: px(MAXHEIGHT + 30),
            backgroundColor: Colors.colorApp,
            cursor: "pointer",
            position: "relative",
          }}
          onClick={() => onSelect(null)}
        >
          {profile && profile.banner === null && (
            <CheckCircleTwoToneIcon
              sx={{
                fontSize: 60,
                color: Colors.green2,
                position: "absolute",
                backgroundColor: "white",
                borderRadius: percent(50),
                top: percent(50),
                right: percent(50),
                transform: "translate(50%, -50%)",
                zIndex: 2,
              }}
            />
          )}
        </Box>
      </Grid>
      {mybanners.map((banner) => {
        const isSelect = profile?.banner && profile.banner.id === banner.id;

        return (
          <Grid
            key={banner.id}
            size={{
              xs: 6,
              sm: 4,
              md: 3
            }}>
            <Box sx={{ position: "relative" }} onClick={() => onSelect(banner)}>
              {isSelect && (
                <CheckCircleTwoToneIcon
                  sx={{
                    fontSize: 60,
                    color: Colors.green2,
                    position: "absolute",
                    backgroundColor: "white",
                    borderRadius: percent(50),
                    top: percent(50),
                    right: percent(50),
                    transform: "translate(50%, -50%)",
                    zIndex: 2,
                  }}
                />
              )}
              <img
                alt="banner"
                src={banner.src}
                style={{
                  width: percent(100),
                  objectFit: "cover",
                  height: px(MAXHEIGHT + 30),
                }}
              />
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};
