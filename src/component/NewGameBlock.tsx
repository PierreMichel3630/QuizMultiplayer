import { Box, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TimerWhite } from "./Timer";

interface Props {
  timer?: number;
}
export const NewGameBlock = ({ timer }: Props) => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: 1,
        textAlign: "center",
        display: "flex",
        gap: 2,
        flexDirection: "column",
      }}
    >
      <Typography variant="h2">{t("commun.startgame")}</Typography>
      <Typography variant="h4">{t("commun.keyboardmessage")}</Typography>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {timer && <TimerWhite time={timer} size={50} thickness={3} />}
      </Box>
    </Paper>
  );
};
