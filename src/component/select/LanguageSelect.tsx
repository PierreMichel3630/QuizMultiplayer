import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import {
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Fragment, useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

export const LanguageSelect = () => {
  const { languages, language, setLanguage } = useUser();
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  return (
    <List>
      {languages.map((lang) => (
        <Fragment key={lang.iso}>
          <ListItem sx={{ p: 0 }}>
            <ListItemButton onClick={() => setLanguage(lang)}>
              <ListItemIcon>
                {language?.iso === lang.iso && (
                  <CheckCircleIcon sx={{ color: Colors.green, fontSize: 25 }} />
                )}
              </ListItemIcon>
              <ListItemIcon>
                <Avatar
                  alt="flag"
                  src={lang.icon}
                  sx={{
                    width: 35,
                    height: 35,
                    border: `2px solid ${
                      isDarkMode ? Colors.white : Colors.black
                    }`,
                  }}
                />
              </ListItemIcon>
              <ListItemText primary={lang.name} />
            </ListItemButton>
          </ListItem>
          <Divider component="li" />
        </Fragment>
      ))}
    </List>
  );
};
