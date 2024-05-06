import { Box, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

export interface LineCompareTable {
  label: string;
  value1: number;
  value2: number;
  fixed?: number;
  max?: number;
}

interface PropsLine {
  value: LineCompareTable;
}

export const LineCompareTable = ({ value }: PropsLine) => {
  const isWin = value.value1 > value.value2;
  const isLose = value.value2 > value.value1;
  const percent1 = value.max ? (value.value1 * 100) / value.max : value.value1;
  const percent2 = value.max ? (value.value2 * 100) / value.max : value.value2;
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{ textAlign: "center", textTransform: "uppercase" }}
      >
        <Typography variant="h6" sx={{ fontSize: 11 }}>
          {value.label}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Typography variant="h6" color={isWin ? Colors.green : Colors.red}>
              {value.fixed ? value.value1.toFixed(value.fixed) : value.value1}
            </Typography>
            <Box
              sx={{
                width: percent(percent1),
                height: px(10),
                borderRadius: px(5),
                bgcolor: isWin ? Colors.green : Colors.red,
              }}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              gap: 1,
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                width: percent(percent2),
                height: px(10),
                borderRadius: px(5),
                bgcolor: isLose ? Colors.green : Colors.red,
              }}
            />
            <Typography variant="h6" color={isLose ? Colors.green : Colors.red}>
              {value.fixed ? value.value2.toFixed(value.fixed) : value.value2}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};
