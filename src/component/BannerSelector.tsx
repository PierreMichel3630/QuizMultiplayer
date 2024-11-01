import { Box, Grid, Typography } from "@mui/material";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import LockTwoToneIcon from "@mui/icons-material/LockTwoTone";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Banner } from "src/models/Banner";
import { Colors } from "src/style/Colors";
import { sortByUnlock } from "src/utils/sort";
import { MoneyBlock } from "./MoneyBlock";
import { SkeletonRectangulars } from "./skeleton/SkeletonRectangular";

interface Props {
  onSelect: (value: Banner | null) => void;
}

export const BannerSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { banners, mybanners } = useApp();
  const { t } = useTranslation();

  const MAXHEIGHT = 150;

  const bannersVerify = useMemo(() => {
    const idUnlock = mybanners.map((el) => el.id);
    return [...banners]
      .map((banner) => ({
        ...banner,
        unlock:
          banner.isaccomplishment || banner.price > 0
            ? idUnlock.includes(banner.id)
            : true,
      }))
      .sort(sortByUnlock);
  }, [mybanners, banners]);

  const bannersUnlock = useMemo(
    () => [...bannersVerify].filter((el) => el.unlock),
    [bannersVerify]
  );

  const bannersLock = useMemo(
    () => [...bannersVerify].filter((el) => !el.unlock),
    [bannersVerify]
  );

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} sm={6}>
        <Box
          sx={{
            width: percent(100),
            height: px(MAXHEIGHT + 30),
            backgroundColor: Colors.blue3,
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
      {bannersUnlock.length === 0 && bannersLock.length === 0 && (
        <SkeletonRectangulars number={2} height={MAXHEIGHT} />
      )}
      {bannersUnlock.map((banner) => {
        const isSelect =
          profile && profile.banner && profile.banner.id === banner.id;
        const image = `/banner/${banner.icon}`;

        return (
          <Grid item xs={12} sm={6} key={banner.id}>
            <Box sx={{ position: "relative" }}>
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
                src={image}
                style={{
                  width: percent(100),
                  objectFit: "cover",
                  height: px(MAXHEIGHT + 30),
                }}
                onClick={() => onSelect(banner)}
              />
            </Box>
          </Grid>
        );
      })}
      {bannersLock.map((banner) => {
        const image = `/banner/${banner.icon}`;

        return (
          <Grid item xs={12} sm={6} key={banner.id}>
            <Box sx={{ position: "relative" }}>
              <Link
                to={`/banner/${banner.id}`}
                style={{ textDecoration: "none" }}
              >
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <img
                    src={image}
                    style={{
                      width: percent(100),
                      objectFit: "cover",
                      height: px(MAXHEIGHT),
                    }}
                  />
                  {banner.price > 0 ? (
                    <Box
                      sx={{
                        zIndex: 10,
                        backgroundColor: Colors.black,
                        p: "15px 5px 5px 5px",
                        display: "flex",
                        justifyContent: "center",
                        position: "relative",
                      }}
                    >
                      <Box
                        sx={{
                          zIndex: 10,
                          position: "absolute",
                          top: 0,
                          left: percent(50),
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <Typography
                          variant="h1"
                          color="text.secondary"
                          sx={{
                            fontSize: "18px !important",
                            WebkitTextStrokeWidth: "1px",
                            WebkitTextStrokeColor: "black",
                          }}
                        >
                          {t("commun.buy")}
                        </Typography>
                      </Box>
                      <MoneyBlock money={banner.price} />
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: Colors.black,
                        p: 1,
                      }}
                    >
                      <LockTwoToneIcon
                        sx={{
                          fontSize: 20,
                          color: Colors.grey4,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {t("commun.unlockaccomplishments")}
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Link>
            </Box>
          </Grid>
        );
      })}
    </Grid>
  );
};
