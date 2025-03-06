import { Box, Divider, Grid } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";
import { RoundLinkButton } from "./button/RoundButton";

import addfriendsAnimate from "src/assets/animation/addfriends.json";
import customizeprofileAnimate from "src/assets/animation/customizeprofile.json";
import shopAnimate from "src/assets/animation/shop.json";
import voteAnimate from "src/assets/animation/vote.json";
import wheelAnimate from "src/assets/animation/wheelprize.json";
import challengeIcon from "src/assets/challenge.png";
import { TimeLeftLabel, TimeLeftToNextDayLabel } from "./TimeLeftBlock";

export const ShopBlock = () => {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <ShopItems />
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};

export const ShopItems = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const wheelDate = useMemo(() => profile?.wheellaunch, [profile]);
  const voteDate = useMemo(() => profile?.datevote, [profile]);

  const options = useMemo(
    () => [
      {
        title: t("commun.daychallenge"),
        icon: challengeIcon,
        link: "/challenge",
        extra: (
          <>
            {profile?.hasPlayChallenge && (
              <Box
                sx={{
                  position: "absolute",
                  top: percent(50),
                  transform: "translate(0%, -50%)",
                  zIndex: 2,
                }}
              >
                <TimeLeftToNextDayLabel size="small" />
              </Box>
            )}
          </>
        ),
      },
      {
        title: t("commun.votetheme"),
        animation: voteAnimate,
        link: "/vote",
        extra: (
          <>
            {voteDate && (
              <Box
                sx={{
                  position: "absolute",
                  top: percent(50),
                  transform: "translate(0%, -50%)",
                  zIndex: 2,
                }}
              >
                <TimeLeftLabel
                  intervalHours={12}
                  lastDate={voteDate}
                  size="small"
                />
              </Box>
            )}
          </>
        ),
      },
      {
        title: t("commun.rewardwheel"),
        animation: wheelAnimate,
        link: "/wheel",
        extra: (
          <>
            {wheelDate && (
              <Box
                sx={{
                  position: "absolute",
                  top: percent(50),
                  transform: "translate(0%, -50%)",
                  zIndex: 2,
                }}
              >
                <TimeLeftLabel
                  intervalHours={12}
                  lastDate={wheelDate}
                  size="small"
                />
              </Box>
            )}
          </>
        ),
      },
      {
        title: t("commun.customizedprofile"),
        animation: customizeprofileAnimate,
        link: "/personalized",
      },
      {
        title: t("commun.seeshop"),
        animation: shopAnimate,
        link: "/shop",
      },
      {
        title: t("commun.sharefriend"),
        animation: addfriendsAnimate,
        link: "/share",
      },
    ],
    [t, profile, voteDate, wheelDate]
  );

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        pb: px(6),
        overflowX: "scroll",
        scrollbarWidth: "none",
      }}
    >
      {options.map((option, index) => (
        <RoundLinkButton
          key={index}
          title={option.title}
          icon={option.icon}
          animation={option.animation}
          link={option.link}
          extra={option.extra}
        />
      ))}
    </Box>
  );
};
