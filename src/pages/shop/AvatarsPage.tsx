import { Box, Grid } from "@mui/material";
import { useMemo } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { AvatarShop } from "src/component/shop/AvatarShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { sortByPriceDesc } from "src/utils/sort";

export default function AvatarsPage() {
  const { t } = useTranslation();
  const { avatars } = useApp();

  const avatarsDisplay = useMemo(
    () => [...avatars].filter((el) => el.price > 0).sort(sortByPriceDesc),
    [avatars]
  );

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center">
        <Helmet>
          <title>{`${t("pages.avatars.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid item xs={12}>
          <TitleBlock title={t("commun.avatars")} />
        </Grid>
        {avatarsDisplay.map((avatar) => (
          <Grid item key={avatar.id}>
            <AvatarShop avatar={avatar} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
