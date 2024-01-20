import { Box, CircularProgress, Typography } from "@mui/material";
import { percent } from "csx";
import { useEffect, useState } from "react";
import { Colors } from "src/style/Colors";

interface Props {
  time: number;
  size?: number;
  thickness?: number;
}

export const Timer = ({ time, size = 50, thickness = 6 }: Props) => {
  const DELAY = 100;
  const [timer, setTimer] = useState(time * 1000);

  useEffect(() => {
    setTimer(time * 1000);
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - DELAY);
    }, DELAY);
    return () => clearInterval(interval);
  }, [time]);

  const pourcentage = (timer / (time * 1000)) * 100;

  const getColor = (pourcentage: number) => {
    let color: string = Colors.green;
    if (pourcentage < 70) {
      color = Colors.yellow;
    }
    if (pourcentage < 40) {
      color = Colors.orange;
    }
    if (pourcentage < 20) {
      color = Colors.red;
    }
    return color;
  };
  const timeValue = timer / 1000;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        backgroundColor: Colors.grey,
        borderRadius: percent(50),
      }}
    >
      <CircularProgress
        variant="determinate"
        value={pourcentage}
        sx={{ color: getColor(pourcentage) }}
        thickness={thickness}
        size={size}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h2"
          component="div"
          sx={{ color: "white", fontSize: 50 }}
        >
          {timeValue < 0 ? 0 : Math.floor(timeValue)}
        </Typography>
      </Box>
    </Box>
  );
};

interface Props {
  time: number;
}

export const TimerWhite = ({ time }: Props) => {
  const DELAY = 100;
  const [timer, setTimer] = useState(time * 1000);

  useEffect(() => {
    setTimer(time * 1000);
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - DELAY);
    }, DELAY);
    return () => clearInterval(interval);
  }, [time]);

  const pourcentage = (timer / (time * 1000)) * 100;
  const timeValue = timer / 1000;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        borderRadius: percent(50),
      }}
    >
      <CircularProgress
        variant="determinate"
        value={pourcentage}
        sx={{ color: Colors.purple }}
        thickness={3}
        size={50}
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="h2"
          component="div"
          sx={{ color: Colors.purple, fontSize: 30 }}
        >
          {timeValue < 0 ? 0 : Math.floor(timeValue)}
        </Typography>
      </Box>
    </Box>
  );
};
