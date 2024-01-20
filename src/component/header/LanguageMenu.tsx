import {
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
} from "@mui/material";
import { percent } from "csx";
import { useState } from "react";

import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { style } from "typestyle";

const divFlagCss = style({
  width: 40,
  height: 40,
  borderRadius: percent(50),
  overflow: "hidden",
});

export const LanguagesMenu = () => {
  const { language, setLanguage, languages } = useUser();

  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchor(event.currentTarget);
  };

  const selectLanguage = (language: Language) => {
    setLanguage(language);
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchor(null);
  };

  return (
    <Box sx={{ flexGrow: 0 }}>
      {language && (
        <>
          <IconButton
            aria-label="language"
            color="inherit"
            onClick={handleOpenMenu}
          >
            <img className={divFlagCss} src={language.icon} />
          </IconButton>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchor}
            anchorOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            open={Boolean(anchor)}
            onClose={handleCloseMenu}
          >
            {languages.map((language) => (
              <MenuItem
                key={language.iso}
                onClick={() => selectLanguage(language)}
              >
                <ListItemIcon>
                  <img className={divFlagCss} src={language.icon} />
                </ListItemIcon>
                <ListItemText>{language.name}</ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
};
