import { Avatar, Box, Typography } from "@mui/material";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { LANGUAGES } from "src/models/Language";
import { Colors } from "src/style/Colors";

interface Props {
  iso: string;
}

export const LanguageBlock = ({ iso }: Props) => {
  const { mode } = useUser();
  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const language = useMemo(() => {
    const result = LANGUAGES.find((el) => el.iso === iso);
    return result;
  }, [iso]);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {language ? (
        <>
          <Avatar
            alt="flag"
            src={language.icon}
            sx={{
              width: 20,
              height: 20,
              border: `2px solid ${isDarkMode ? Colors.white : Colors.black}`,
            }}
          />
          <Typography>{language.name}</Typography>
        </>
      ) : (
        <Typography>{iso}</Typography>
      )}
    </Box>
  );
};
