import { Box, Grid, Paper, Typography } from "@mui/material";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { Colors } from "src/style/Colors";
import { Answer } from "src/models/Answer";

interface Props {
  answers: Array<Answer>;
}
export const AnswersBlock = ({ answers }: Props) => {
  return (
    <Grid container spacing={1}>
      {answers.map((answer, i) => (
        <Grid item xs={6} key={i}>
          <Paper
            sx={{
              p: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{answer.value}</Typography>
            <Box
              sx={{
                gap: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography variant="body1">
                {(answer.time / 1000).toFixed(2)}s
              </Typography>
              {answer.response ? (
                <CheckCircleOutlinedIcon sx={{ color: Colors.green }} />
              ) : (
                <CancelOutlinedIcon sx={{ color: Colors.red }} />
              )}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
