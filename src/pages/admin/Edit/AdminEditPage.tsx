import { Grid, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

enum Menu {
  CATEGORIES = "CATEGORIES",
  THEME = "THEME",
  QUESTIONS = "QUESTIONS",
  SHOP = "SHOP",
  CHALLENGE = "CHALLENGE",
}

interface MenuItem {
  value: Menu;
  label: string;
  link: string;
}

export default function AdminEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(
    location.pathname.split("/").pop()?.toUpperCase() ?? Menu.CHALLENGE
  );

  const menus: Array<MenuItem> = [
    {
      value: Menu.CATEGORIES,
      label: t("commun.categories"),
      link: "/administration/edit/categories",
    },
    {
      value: Menu.THEME,
      label: t("commun.theme"),
      link: "/administration/edit/theme",
    },
    {
      value: Menu.QUESTIONS,
      label: t("commun.questions"),
      link: "/administration/edit/questions",
    },
  ];

  const handleChange = (_event: React.SyntheticEvent, newValue: Menu) => {
    setValue(newValue);
    const newMenu = menus.find((el) => el.value === newValue);
    if (newMenu) {
      navigate(newMenu.link);
    }
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
        <Tabs value={value} onChange={handleChange} centered>
          {menus.map((menu, index) => (
            <Tab key={index} label={menu.label} value={menu.value} />
          ))}
        </Tabs>
      </Grid>
      <Grid size={12}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
