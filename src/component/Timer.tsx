import { Box, CircularProgress, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import { Colors } from "src/style/Colors";

interface Props {
  time?: number;
}

export const Timer = ({ time }: Props) => {
  const DELAY = 100;
  const [intervalTimer, setIntervalTimer] = useState<
    NodeJS.Timeout | undefined
  >(undefined);
  const [totalTime, setTotalTime] = useState(1);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (time) {
      setTotalTime(time);
      setTimer(time * 1000);
    } else {
      clearInterval(intervalTimer);
    }
  }, [intervalTimer, time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - DELAY);
    }, DELAY);
    setIntervalTimer(interval);
    return () => clearInterval(interval);
  }, [time]);

  useEffect(() => {
    if (timer <= 0) {
      clearInterval(intervalTimer);
    }
  }, [intervalTimer, timer]);

  const pourcentage = (timer / (totalTime * 1000)) * 100;

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

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: Colors.grey,
        borderRadius: px(5),
        height: px(10),
        width: percent(100),
      }}
    >
      <Box
        sx={{
          borderTopLeftRadius: px(5),
          borderBottomLeftRadius: px(5),
          height: percent(100),
          width: percent(pourcentage),
          backgroundColor: getColor(pourcentage),
        }}
      />
    </Box>
  );
};

interface PropsVerticalTimer {
  time: number | undefined;
  color: string;
  answer: number | undefined;
}

export const VerticalTimer = ({ time, color, answer }: PropsVerticalTimer) => {
  const DELAY = 100;
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    setTimer(time ? time * 1000 : 0);
  }, [time]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => prev - DELAY);
    }, DELAY);
    return () => clearInterval(interval);
  }, [time]);

  const pourcentage = useMemo(
    () => (time ? (timer / (time * 1000)) * 100 : 0),
    [time, timer]
  );
  const pourcentageAnswer = useMemo(
    () => (answer ? 100 - (answer / ((time ? time : 10) * 1000)) * 100 : 0),
    [time, answer]
  );

  return (
    <Box
      sx={{
        display: "flex",
        position: "relative",
        flexDirection: "column-reverse",
        backgroundColor: Colors.grey,
        borderRadius: px(5),
        height: percent(100),
        width: px(8),
      }}
    >
      {answer ? (
        <Box
          sx={{
            position: "absolute",
            borderRadius: px(5),
            height: percent(pourcentageAnswer),
            width: percent(100),
            backgroundColor: color,
          }}
        />
      ) : (
        <Box
          sx={{
            borderRadius: px(5),
            height: percent(pourcentage),
            width: percent(100),
            backgroundColor: color,
          }}
        />
      )}
    </Box>
  );
};

interface PropsRoundTimer {
  time: number;
  size?: number;
  thickness?: number;
  fontSize?: number;
}

export const RoundTimer = ({
  time,
  size = 50,
  thickness = 6,
  fontSize = 50,
}: PropsRoundTimer) => {
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
          sx={{ color: "white", fontSize: fontSize }}
        >
          {timeValue < 0 ? 0 : Math.floor(timeValue)}
        </Typography>
      </Box>
    </Box>
  );
};
