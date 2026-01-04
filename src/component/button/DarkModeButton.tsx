import { useCallback, useMemo } from "react";
import { useUser } from "src/context/UserProvider";

import WbSunnyIcon from "@mui/icons-material/WbSunny";
import BedtimeIcon from "@mui/icons-material/Bedtime";
import { Box } from "@mui/material";
import { padding, px } from "csx";
import { Colors } from "src/style/Colors";

export const DarkModeButton = () => {
  const { mode, setMode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  const onChangeMode = useCallback(() => {
    setMode(mode === "dark" ? "light" : "dark");
  }, [mode, setMode]);

  return (
    <Box
      onClick={onChangeMode}
      sx={{
        p: padding(2, 8),
        border: "2px solid",
        borderColor: Colors.white,
        borderRadius: px(5),
        display: "flex",
        backgroundColor: isDarkMode ? Colors.blue4 : Colors.yellow,
      }}
    >
      {isDarkMode ? (
        <BedtimeIcon />
      ) : (
        <WbSunnyIcon sx={{ color: Colors.white }} />
      )}
    </Box>
  );
};
