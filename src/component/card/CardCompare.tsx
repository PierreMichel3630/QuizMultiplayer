import { Divider, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { ComparePlayerInfos, ComparePlayers } from "src/models/Compare";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { LineCompareTable } from "../LineCompareTable";
import { BarVictory } from "../chart/BarVictory";

interface Props {
  value: ComparePlayers;
}

export const CardCompare = ({ value }: Props) => {
  const { t } = useTranslation();
  return (
    <Paper
      sx={{
        overflow: "hidden",
        backgroundColor: Colors.grey,
        height: percent(100),
      }}
    >
      <Grid container>
        <Grid
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
            backgroundColor: Colors.colorApp,
            p: px(5),
          }}
          size={12}>
          <ImageThemeBlock theme={value.theme} size={40} />
          <Typography
            variant="h2"
            sx={{
              wordWrap: "anywhere",
              fontSize: 18,
            }}
            color="text.secondary"
          >
            {value.theme.name}
          </Typography>
        </Grid>
        <Grid sx={{ p: 1 }} size={12}>
          <Grid
            container
            spacing={1}
            alignItems="center"
            justifyContent="center"
          >
            {value.opposition && (
              <>
                <Grid sx={{ textAlign: "center" }} size={12}>
                  <Typography variant="h4">{t("commun.opposition")}</Typography>
                </Grid>
                <Grid size={12}>
                  <BarVictory
                    victory={value.opposition.victory}
                    draw={value.opposition.draw}
                    defeat={value.opposition.defeat}
                  />
                </Grid>
                <Grid size={12}>
                  <Divider sx={{ borderBottomWidth: 3 }} />
                </Grid>
              </>
            )}
            {((value.score_player1 && value.score_player1.duelgames > 0) ||
              (value.score_player2 && value.score_player2.duelgames > 0)) && (
              <CompareDuel
                score1={value.score_player1}
                score2={value.score_player2}
              />
            )}
            {((value.score_player1 && value.score_player1.games > 0) ||
              (value.score_player2 && value.score_player2.games > 0)) && (
              <CompareSolo
                score1={value.score_player1}
                score2={value.score_player2}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface PropsCompare {
  score1: ComparePlayerInfos | null;
  score2: ComparePlayerInfos | null;
}

const CompareSolo = ({ score1, score2 }: PropsCompare) => {
  const { t } = useTranslation();

  const datasSolo = [
    {
      label: t("commun.games"),
      value1: score1 ? score1.games : 0,
      value2: score2 ? score2.games : 0,
      max: Math.max(score1 ? score1.games : 0, score2 ? score2.games : 0),
    },
    {
      label: t("commun.bestscore"),
      value1: score1 ? score1.points : 0,
      value2: score2 ? score2.points : 0,
      max: Math.max(score1 ? score1.points : 0, score2 ? score2.points : 0),
    },
  ];
  return (
    <>
      <Grid sx={{ textAlign: "center" }} size={12}>
        <Typography variant="h4">{t("commun.solo")}</Typography>
      </Grid>
      {datasSolo.map((el, index) => (
        <Grid key={index} size={12}>
          <LineCompareTable value={el} />
        </Grid>
      ))}
    </>
  );
};

interface PropsCompare {
  score1: ComparePlayerInfos | null;
  score2: ComparePlayerInfos | null;
}

const CompareDuel = ({ score1, score2 }: PropsCompare) => {
  const { t } = useTranslation();

  const maxDuel = Math.max(
    score1 ? score1.duelgames : 0,
    score2 ? score2.duelgames : 0
  );
  const datasDuel = [
    {
      label: t("commun.games"),
      value1: score1 ? score1.duelgames : 0,
      value2: score2 ? score2.duelgames : 0,
      max: maxDuel,
    },
    {
      label: t("commun.victory"),
      value1: score1 ? score1.victory : 0,
      value2: score2 ? score2.victory : 0,
      max: maxDuel,
    },
    {
      label: t("commun.draw"),
      value1: score1 ? score1.draw : 0,
      value2: score2 ? score2.draw : 0,
      max: maxDuel,
    },
    {
      label: t("commun.defeat"),
      value1: score1 ? score1.defeat : 0,
      value2: score2 ? score2.defeat : 0,
      max: maxDuel,
    },
    {
      label: t("commun.points"),
      value1: score1 ? score1.rank : 0,
      value2: score2 ? score2.rank : 0,
      max: Math.max(score1 ? score1.rank : 0, score2 ? score2.rank : 0),
    },
  ];
  return (
    <>
      <Grid sx={{ textAlign: "center" }} size={12}>
        <Typography variant="h4">{t("commun.duel")}</Typography>
      </Grid>
      {datasDuel.map((el, index) => (
        <Grid key={index} size={12}>
          <LineCompareTable value={el} />
        </Grid>
      ))}
      <Grid size={12}>
        <Divider sx={{ borderBottomWidth: 3 }} />
      </Grid>
    </>
  );
};
