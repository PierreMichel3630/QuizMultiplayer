import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";

interface Props {
  start: boolean;
}
export const Chronometer = ({ start }: Props) => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    let intervalId: undefined | NodeJS.Timeout = undefined;
    if (start) {
      // setting time from 0 to 1 every 10 milisecond using javascript setInterval method
      intervalId = setInterval(() => setTime((prev) => prev + 10), 100);
    }
    return () => clearInterval(intervalId);
  }, [start, time]);

  const seconds = useMemo(() => Math.floor(time / 100), [time]);

  const milliseconds = useMemo(() => time % 100, [time]);

  return (
    <Box>
      <Typography variant="h2">
        {seconds.toString().padStart(2, "0")}:
        {milliseconds.toString().padStart(2, "0")}
      </Typography>
    </Box>
  );
};
