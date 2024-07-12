import HistoryIcon from "@mui/icons-material/History";
import { Grid, Paper, Skeleton, Typography } from "@mui/material";
import { px } from "csx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { Profile } from "src/models/Profile";
import { Score } from "src/models/Score";
import { Colors } from "src/style/Colors";
import { sortByDuelGamesDesc, sortByGamesDesc } from "src/utils/sort";
import { ButtonColor } from "../Button";
import { ToogleButtonCard } from "../ToogleButton";
import { BarVictory } from "./BarVictory";
import { DonutChart } from "./DonutChart";

interface Props {
  scores: Array<Score>;
  totalScore: { victory: number; draw: number; defeat: number };
  totalSolo: number;
  profile?: Profile;
  loading?: boolean;
}
export const DonutGames = ({
  scores,
  totalScore,
  totalSolo,
  profile,
  loading = true,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useUser();

  const MAXVALUEDISPLAY = 7;

  const [type, setType] = useState<"solo" | "duel">("solo");
  const types = [
    { label: t("commun.solo"), value: "solo" },
    { label: t("commun.duel"), value: "duel" },
  ];

  const dataSolo = useMemo(
    () =>
      scores.sort(sortByGamesDesc).reduce(
        (acc, score, index) => {
          if (index + 1 <= MAXVALUEDISPLAY) {
            const label = score.theme.name[language.iso]
              ? score.theme.name[language.iso]
              : score.theme.name["fr-FR"];
            return [
              ...acc,
              {
                name: label,
                value: score ? score.games : 0,
                color: score.theme.color,
              },
            ];
          } else {
            const other = { ...acc[0], value: acc[0].value + score.games };
            return [other, ...acc.filter((_el, index) => index !== 0)];
          }
        },
        [
          {
            name: t("commun.others"),
            value: 0,
            color: Colors.black,
          },
        ]
      ),
    [scores, t, language.iso]
  );

  const dataDuel = useMemo(
    () =>
      scores.sort(sortByDuelGamesDesc).reduce(
        (acc, score, index) => {
          if (index + 1 <= MAXVALUEDISPLAY) {
            const label = score.theme.name[language.iso]
              ? score.theme.name[language.iso]
              : score.theme.name["fr-FR"];
            return [
              ...acc,
              {
                name: label,
                value: score ? score.duelgames : 0,
                color: score.theme.color,
              },
            ];
          } else {
            const other = { ...acc[0], value: acc[0].value + score.duelgames };
            return [other, ...acc.filter((_el, index) => index !== 0)];
          }
        },
        [
          {
            name: t("commun.others"),
            value: 0,
            color: Colors.black,
          },
        ]
      ),
    [scores, t, language.iso]
  );

  const data = useMemo(
    () => (type === "solo" ? dataSolo : dataDuel),
    [dataSolo, dataDuel, type]
  );

  return (
    (loading || scores.length > 0) && (
      <Paper sx={{ overflow: "hidden", backgroundColor: Colors.lightgrey }}>
        <Grid container>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: Colors.blue3,
              p: px(5),
            }}
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <Typography
                  variant="h2"
                  sx={{
                    wordWrap: "break-word",
                    fontSize: 18,
                  }}
                  color="text.secondary"
                >
                  {t("commun.gamesplay")}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{ display: "flex", justifyContent: "flex-end" }}
              >
                <ToogleButtonCard
                  select={type}
                  onChange={(value) => setType(value as "solo" | "duel")}
                  values={types}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              backgroundColor: Colors.grey,
              display: "flex",
              p: 1,
            }}
          >
            <Grid container spacing={1} justifyContent="center">
              {loading ? (
                <>
                  <Grid
                    item
                    xs={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <Skeleton variant="rectangular" width={120} height={15} />
                  </Grid>
                  <Grid item>
                    <Skeleton variant="circular" width={250} height={250} />
                  </Grid>
                </>
              ) : (
                <>
                  {type === "duel" ? (
                    <>
                      <Grid item xs={12} sx={{ textAlign: "center" }}>
                        <Typography variant="body1" component="span">
                          {t("commun.games")} {" : "}
                        </Typography>
                        <Typography variant="h4" component="span">
                          {totalScore.victory +
                            totalScore.draw +
                            totalScore.defeat}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <BarVictory
                          victory={totalScore.victory}
                          draw={totalScore.draw}
                          defeat={totalScore.defeat}
                        />
                      </Grid>
                    </>
                  ) : (
                    <Grid item xs={12} sx={{ textAlign: "center" }}>
                      <Typography variant="body1" component="span">
                        {t("commun.games")} {" : "}
                      </Typography>
                      <Typography variant="h4" component="span">
                        {totalSolo}
                      </Typography>
                    </Grid>
                  )}
                  <Grid item xs={12}>
                    <DonutChart data={data.filter((el) => el.value !== 0)} />
                  </Grid>
                  {profile && (
                    <Grid item xs={12}>
                      <ButtonColor
                        value={Colors.blue2}
                        label={t("commun.gamehistory")}
                        icon={HistoryIcon}
                        variant="contained"
                        onClick={() =>
                          navigate(`/games`, {
                            state: {
                              player: profile,
                              type: type.toUpperCase(),
                            },
                          })
                        }
                      />
                    </Grid>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    )
  );
};
