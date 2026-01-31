import { Grid, Box, IconButton, Typography } from "@mui/material";
import moment, { Moment } from "moment";
import { useCallback, useMemo } from "react";

import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { DateFormat } from "src/models/enum/DateEnum";

interface Props {
  date: Moment;
  format: DateFormat;
  onChange: (value: Moment) => void;
  isDisabledDate?: boolean;
}

export const ChangeDateBlock = ({
  date,
  format,
  onChange,
  isDisabledDate = true,
}: Props) => {
  const dateDisplay = useMemo(() => {
    let result = undefined;
    if (format === "day") {
      result = date.format("DD/MM/YYYY");
    } else if (format === "month") {
      result = date.format("MM/YYYY");
    } else if (format === "week") {
      const start = date.clone().weekday(1);
      const end = date.clone().weekday(7);
      result = `${start.format("DD MMM")} - ${end.format("DD MMM YYYY")}`;
    }
    return result;
  }, [date, format]);

  const isDisabledNextDay = useMemo(() => {
    const today = moment().startOf("day");
    let future = moment(date).startOf("day");
    if (format === "day") {
      future = future.add(1, "day");
    } else if (format === "month") {
      future = future.add(1, "month");
    } else if (format === "week") {
      future = future.add(1, "week");
    }
    return today.diff(future) < 0;
  }, [date, format]);

  const substractDate = useCallback(() => {
    onChange(moment(date).subtract(1, format));
  }, [date, format, onChange]);

  const addDate = useCallback(() => {
    onChange(moment(date).add(1, format));
  }, [date, format, onChange]);

  return (
    <Grid size={12}>
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <IconButton onClick={substractDate} size="small">
          <KeyboardArrowLeftIcon fontSize="large" />
        </IconButton>
        <Typography variant="h4" sx={{ textAlign: "center" }}>
          {dateDisplay}
        </Typography>
        <IconButton
          onClick={addDate}
          disabled={isDisabledDate ? isDisabledNextDay : false}
          size="small"
        >
          <KeyboardArrowRightIcon fontSize="large" />
        </IconButton>
      </Box>
    </Grid>
  );
};
