import { Box, Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { RoundLinkButton } from "./button/RoundButton";

import personalizeIcon from "src/assets/personalize.png";
import shopIcon from "src/assets/store.png";
import wheelIcon from "src/assets/wheel.png";

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

  const options = [
    {
      title: t("commun.seeshop"),
      icon: shopIcon,
      link: "/shop",
    },
    {
      title: t("commun.rewardwheel"),
      icon: wheelIcon,
      link: "/wheel",
    },
    {
      title: t("commun.customizedprofile"),
      icon: personalizeIcon,
      link: "/personalized",
    },
  ];

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {options.map((option, index) => (
        <RoundLinkButton
          key={index}
          title={option.title}
          icon={option.icon}
          link={option.link}
        />
      ))}
    </Box>
  );
};
