import { Box, Divider, Grid } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "src/context/AuthProviderSupabase";
import { RoundLinkButton } from "./button/RoundButton";

import personalizeIcon from "src/assets/personalize.png";
import ShareIcon from "src/assets/share.png";
import shopIcon from "src/assets/store.png";
import VoteIcon from "src/assets/vote.png";
import wheelIcon from "src/assets/wheel.png";
import { px } from "csx";

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
        icon: VoteIcon,
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
        icon: wheelIcon,
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
        icon: personalizeIcon,
        link: "/personalized",
      },
      {
        title: t("commun.seeshop"),
        icon: shopIcon,
        link: "/shop",
      },
      {
        title: t("commun.sharefriend"),
        icon: ShareIcon,
        link: "/share",
      },
    ],
    [t, wheelDate, voteDate]
  );

  return (
    <Box sx={{ display: "flex", gap: 1, pb: px(6), overflowX: "scroll" }}>
      {options.map((option, index) => (
        <RoundLinkButton
          key={index}
          title={option.title}
          icon={option.icon}
          link={option.link}
          time={option.time}
        />
      ))}
    </Box>
  );
};
