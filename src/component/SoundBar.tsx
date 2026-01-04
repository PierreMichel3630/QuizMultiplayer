import { Box, Slider } from "@mui/material";

import VolumeMuteIcon from "@mui/icons-material/VolumeMute";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { useUser } from "src/context/UserProvider";

export const SoundBar = () => {
  const { sound, setSound } = useUser();

  const handleChange = (_event: Event, newValue: number | number[]) => {
    setSound(newValue as number);
  };

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
    >
      <VolumeMuteIcon
        fontSize="large"
        sx={{ cursor: "pointer" }}
        onClick={() => setSound(0)}
      />
      <Box sx={{ width: 120, display: "flex" }}>
        <Slider
          aria-label="Volume"
          value={sound}
          onChange={handleChange}
          color="primary"
          min={0}
          max={100}
        />
      </Box>
      <VolumeUpIcon
        fontSize="large"
        sx={{ cursor: "pointer" }}
        onClick={() => setSound(100)}
      />
    </Box>
  );
};
