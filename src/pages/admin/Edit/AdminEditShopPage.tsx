import { Grid, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import AdminEditThemeShopPage from "./shop/AdminEditThemeShopPage";
import AdminEditAvatarShopPage from "./shop/AdminEditAvatarShopPage";

enum Menu {
  themes = "themes",
  avatars = "avatars",
  banners = "banners",
  titles = "titles",
}

export default function AdminEditShopPage() {
  const { t } = useTranslation();
  const [value, setValue] = useState(Menu.themes);

  const menus = [
    { label: t("commun.themes"), value: "themes" },
    { label: t("commun.avatars"), value: "avatars" },
    { label: t("commun.banners"), value: "banners" },
    { label: t("commun.titles"), value: "titles" },
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: Menu) => {
    setValue(newValue);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Tabs value={value} onChange={handleChange} centered>
          {menus.map((menu, index) => (
            <Tab key={index} label={menu.label} value={menu.value} />
          ))}
        </Tabs>
      </Grid>
      <Grid item xs={12}>
        {
          {
            themes: <AdminEditThemeShopPage />,
            avatars: <AdminEditAvatarShopPage />,
            banners: <AdminEditThemeShopPage />,
            titles: <AdminEditThemeShopPage />,
          }[value]
        }
      </Grid>
    </Grid>
  );
}
