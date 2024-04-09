import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";

import { useUser } from "src/context/UserProvider";
import { Language } from "src/models/Language";
import { Colors } from "src/style/Colors";

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
            sx={{ p: 0 }}
          >
            <Avatar
              src={language.icon}
              sx={{
                width: 40,
                height: 40,
                border: `2px solid ${Colors.white}`,
              }}
            />
          </IconButton>
          <Menu
            sx={{ mt: "45px", backgroundColor: "primary" }}
            id="menu-appbar"
            anchorEl={anchor}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchor)}
            onClose={handleCloseMenu}
          >
            {languages.map((language) => (
              <MenuItem
                key={language.iso}
                onClick={() => selectLanguage(language)}
                sx={{ pl: 1, pr: 1 }}
              >
                <ListItemIcon>
                  <Avatar
                    src={language.icon}
                    sx={{ width: 32, height: 32, mr: 1 }}
                  />
                </ListItemIcon>
                <ListItemText>
                  <Typography variant="h6">{language.name}</Typography>
                </ListItemText>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );
};
