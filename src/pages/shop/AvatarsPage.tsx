import { Box, Grid } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { selectAvatar } from "src/api/avatar";
import { AvatarShop } from "src/component/shop/AvatarShop";
import { TitleBlock } from "src/component/title/Title";
import { useApp } from "src/context/AppProvider";
import { Avatar } from "src/models/Avatar";
import { sortByPriceDesc } from "src/utils/sort";

export default function AvatarsPage() {
  const { t } = useTranslation();
  const { myAvatars } = useApp();

  const [avatars, setAvatars] = useState<Array<Avatar>>([]);

  useEffect(() => {
    const getAvatars = () => {
      selectAvatar().then(({ data }) => {
        const value = data !== null ? (data as Array<Avatar>) : [];
        setAvatars(value);
      });
    };
    getAvatars();
  }, []);

  const avatarsDisplay = useMemo(() => {
    const idsBuy = myAvatars.map((el) => el.id);
    return [...avatars]
      .filter((el) => el.price > 0 && !idsBuy.includes(el.id))
      .sort(sortByPriceDesc);
  }, [avatars, myAvatars]);

  return (
    <Box sx={{ p: 1 }}>
      <Grid container spacing={1} justifyContent="center">
        <Helmet>
          <title>{`${t("pages.avatars.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid size={12}>
          <TitleBlock title={t("commun.avatars")} />
        </Grid>
        {avatarsDisplay.map((avatar) => (
          <Grid key={avatar.id}>
            <AvatarShop avatar={avatar} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
