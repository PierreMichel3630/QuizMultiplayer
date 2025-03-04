import { Box, Divider, Grid } from "@mui/material";
import { px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";
import { RoundLinkButton } from "./button/RoundButton";

import addfriendsAnimate from "src/assets/animation/addfriends.json";
import customizeprofileAnimate from "src/assets/animation/customizeprofile.json";
import shopAnimate from "src/assets/animation/shop.json";
import voteAnimate from "src/assets/animation/vote.json";
import wheelAnimate from "src/assets/animation/wheelprize.json";

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
        title: t("commun.votetheme"),
        animation: voteAnimate,
        link: "/vote",
        time: voteDate
          ? {
              last: voteDate,
              interval: 12,
            }
          : undefined,
      },
      {
        title: t("commun.rewardwheel"),
        animation: wheelAnimate,
        link: "/wheel",
        time: wheelDate
          ? {
              last: wheelDate,
              interval: 12,
            }
          : undefined,
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
    [t, wheelDate, voteDate]
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
          animation={option.animation}
          link={option.link}
          time={option.time}
        />
      ))}
    </Box>
  );
};
