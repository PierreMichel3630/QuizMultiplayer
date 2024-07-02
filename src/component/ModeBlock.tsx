import { Box, Grid, Typography } from "@mui/material";
import { important, percent, px } from "csx";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SupervisedUserCircleRoundedIcon from "@mui/icons-material/SupervisedUserCircleRounded";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Mode {
  icon: JSX.Element;
  color: string;
  title: string;
  goal: string;
  explain: string;
}

interface Props {
  summary?: boolean;
}
export const ModesBlock = ({ summary = false }: Props) => {
  const { t } = useTranslation();

  const modes: Array<Mode> = [
    {
      color: Colors.blue2,
      icon: <PlayCircleIcon fontSize="large" sx={{ color: Colors.white }} />,
      title: t("modes.mode1.title"),
      goal: t("modes.mode1.goal"),
      explain: t("modes.mode1.explain"),
    },
    {
      color: Colors.red,
      icon: <OfflineBoltIcon fontSize="large" sx={{ color: Colors.white }} />,
      title: t("modes.mode2.title"),
      goal: t("modes.mode2.goal"),
      explain: t("modes.mode2.explain"),
    },
    {
      color: Colors.green,
      icon: (
        <SupervisedUserCircleRoundedIcon
          fontSize="large"
          sx={{ color: Colors.white }}
        />
      ),
      title: t("modes.mode3.title"),
      goal: t("modes.mode3.goal"),
      explain: t("modes.mode3.explain"),
    },
    {
      color: Colors.purple,
      icon: <FitnessCenterIcon fontSize="large" sx={{ color: Colors.white }} />,
      title: t("modes.mode4.title"),
      goal: t("modes.mode4.goal"),
      explain: t("modes.mode4.explain"),
    },
  ];

  return (
    <Grid container spacing={1}>
      {modes.map((mode, i) => (
        <Grid item xs={12} key={i}>
          <ModeBlock mode={mode} summary={summary} />
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsModeBlock {
  mode: Mode;
  summary: boolean;
}

const ModeBlock = ({ mode, summary }: PropsModeBlock) => {
  return (
    <Box
      sx={{
        p: 1,
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: percent(100),
        borderRadius: 2,
        height: percent(100),
        backgroundColor: mode.color,
      }}
    >
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {mode.icon}
          <Typography variant="h2" color="text.secondary">
            {mode.title}
          </Typography>
        </Grid>

        {!summary && (
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              color="text.secondary"
              sx={{ fontSize: important(px(12)) }}
            >
              {mode.goal}
            </Typography>
          </Grid>
        )}
        <Grid item xs={12}>
          <Typography variant="body1" color="text.secondary">
            {mode.explain}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
