import { Box, Slider } from "@mui/material";

import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useMemo, useState } from "react";
import { useUser } from "src/context/UserProvider";

export const SoundMenu = () => {
  const { sound, setSound } = useUser();

  const [open, setOpen] = useState(false);

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setSound(newValue as number);
  };

  const getIcon = useMemo(() => {
    let icon = <VolumeDownIcon fontSize="large" sx={{ color: "white" }} />;
    if (sound > 80) {
      icon = <VolumeUpIcon fontSize="large" sx={{ color: "white" }} />;
    } else if (sound > 50) {
      icon = <VolumeDownIcon fontSize="large" sx={{ color: "white" }} />;
    } else if (sound > 0) {
      icon = <VolumeMuteIcon fontSize="large" sx={{ color: "white" }} />;
    } else {
      icon = <VolumeOffIcon fontSize="large" sx={{ color: "white" }} />;
    }
    return icon;
  }, [sound]);

  return (
    <Box
      sx={{
        flexGrow: 0,
        display: "flex",
        mr: 1,
        alignItems: "center",
        cursor: "pointer",
        gap: 2,
      }}
      onClick={() => setOpen((prev) => !prev)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {getIcon}
      {open && (
        <Box sx={{ width: 80, display: "flex" }}>
          <Slider
            aria-label="Volume"
            value={sound}
            onChange={handleChange}
            color="primary"
            min={0}
            max={100}
            sx={{ color: "white" }}
          />
        </Box>
      )}
    </Box>
  );
};
