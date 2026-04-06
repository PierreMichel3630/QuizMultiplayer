import { Container, InputBase, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { important, percent, px } from "csx";
import { useCallback, useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { ButtonColor } from "src/component/Button";
import { TitleBlock } from "src/component/title/Title";
import { Colors } from "src/style/Colors";

import { useNavigate } from "react-router-dom";
import { saveGameModeScore } from "src/api/gamemode";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { ChangeNumberBlock } from "src/component/ChangeBlock";
import { MyExperienceSoloBlock } from "src/component/ExperienceBlock";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { RankingGameMode } from "src/component/ranking/gamemode/RankingGameMode";
import { Timer } from "src/component/time/Timer";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { ResultGameModeScore } from "src/models/GameMode";
import { generateRandomNumber } from "src/utils/random";

enum StatusGame {
  NOTSTART = "NOTSTART",
  PLAY = "PLAY",
  WAIT = "WAIT",
  ANSWER = "ANSWER",
  FINISH = "FINISH",
}
export default function NumberMemoryPage() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const type = TypeGameMode.numbermemory;

  const [answer, setAnswer] = useState("");
  const [numberToGuess, setNumberToGuess] = useState<number | undefined>(
    undefined,
  );
  const [score, setScore] = useState(0);

  const [statusGame, setStatusGame] = useState<StatusGame>(StatusGame.NOTSTART);
  const [dataResult, setDataResult] = useState<null | ResultGameModeScore>(
    null,
  );

  const timerRef = useRef<undefined | number>(undefined);

  const reset = () => {
    setScore(0);
    setNumberToGuess(undefined);
    launchRound(0);
  };

  const launchRound = useCallback((currentScore: number) => {
    timerRef.current = 3 + currentScore * 0.5;
    const newNumber = generateRandomNumber(currentScore + 1);
    setNumberToGuess(newNumber);
    setAnswer("");
    setStatusGame(StatusGame.PLAY);
  }, []);

  const validate = useCallback(() => {
    timerRef.current = undefined;
    if (Number(answer) === numberToGuess) {
      const nextScore = score + 1;
      setScore(nextScore);
      setStatusGame(StatusGame.ANSWER);
    } else {
      setStatusGame(StatusGame.FINISH);
      if (profile) {
        saveGameModeScore(score, type).then(({ data }) => {
          setDataResult(data);
        });
      }
    }
  }, [answer, numberToGuess, profile, score, type]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (statusGame === StatusGame.ANSWER && event.key === "Enter") {
        launchRound(score);
      }
    };

    globalThis.addEventListener("keydown", handleKeyDown);

    return () => {
      globalThis.removeEventListener("keydown", handleKeyDown);
    };
  }, [launchRound, statusGame, score]);

  return (
    <Container maxWidth="md">
      <Grid container>
        <Helmet>
          <title>{`${t("pages.braintest.title")} - ${t("appname")}`}</title>
        </Helmet>

        <Grid size={12}>
          {statusGame === StatusGame.PLAY && (
            <Box
              sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                userSelect: "none",
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 9999,
                p: 2,
              }}
            >
              <Grid container spacing={1} sx={{ width: percent(100) }}>
                {numberToGuess !== null && (
                  <Grid size={12} sx={{ textAlign: "center" }}>
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: important(px(40)),
                        wordBreak: "break-all",
                      }}
                    >
                      {numberToGuess}
                    </Typography>
                  </Grid>
                )}
                <Grid size={12}>
                  <Timer
                    time={timerRef.current ?? 3}
                    end={() => {
                      setStatusGame(StatusGame.WAIT);
                    }}
                  />
                </Grid>
              </Grid>
              <Box></Box>
            </Box>
          )}
          {statusGame === StatusGame.WAIT && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                width: percent(100),
                height: "100vh",
                padding: 2,
              }}
            >
              <Grid
                container
                spacing={1}
                sx={{ textAlign: "center", width: percent(100) }}
              >
                <Grid size={12}>
                  <Typography variant="h2">
                    {t("gamemode.numbermemory.placeholder")}
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <form
                    onSubmit={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      validate();
                    }}
                  >
                    <InputBase
                      fullWidth
                      autoFocus
                      value={answer}
                      onChange={(event) => setAnswer(event.target.value)}
                      sx={{
                        border: `2px solid grey`,
                        borderRadius: px(15),
                      }}
                      inputProps={{
                        style: {
                          textAlign: "center",
                          fontSize: px(40),
                          fontFamily: ["Montserrat", "sans-serif"].join(","),
                          fontWeight: 700,
                        },
                      }}
                    />
                  </form>
                </Grid>
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.green}
                    label={t("commun.validate")}
                    variant="contained"
                    onClick={validate}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          {statusGame === StatusGame.ANSWER && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                width: percent(100),
                height: "100vh",
                padding: 2,
              }}
            >
              <Grid
                container
                spacing={2}
                sx={{ textAlign: "center", width: percent(100) }}
              >
                <Grid
                  size={12}
                  sx={{
                    display: "flex",
                    gap: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="h6">{t("gamemode.score")} :</Typography>
                  <Typography variant="h2">{score}</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h6">
                    {t("gamemode.numbermemory.number")}
                  </Typography>
                  <Typography variant="h2">{numberToGuess}</Typography>
                </Grid>
                <Grid size={12}>
                  <Typography variant="h6" color="text.secondary">
                    {t("gamemode.numbermemory.answer")}
                  </Typography>
                  <Typography variant="h2">{answer}</Typography>
                </Grid>
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.green}
                    label={t("gamemode.numbermemory.continue")}
                    variant="contained"
                    onClick={() => launchRound(score)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
          {statusGame === StatusGame.NOTSTART && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12}>
                  <TitleBlock title={t("gamemode.numbermemory.name")} />
                </Grid>
                <Grid size={12}>
                  <Typography fontSize={15}>
                    {t("gamemode.numbermemory.rules")}
                  </Typography>
                </Grid>
                {profile === null && (
                  <Grid
                    size={12}
                    sx={{ display: "flex", justifyContent: "center" }}
                  >
                    <ConnectAlert />
                  </Grid>
                )}
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.colorApp}
                    label={t("commun.launchgame")}
                    variant="contained"
                    onClick={reset}
                  />
                </Grid>
                <Grid size={12}>
                  <RankingGameMode type={type} />
                </Grid>
              </Grid>
            </Box>
          )}

          {statusGame === StatusGame.FINISH && (
            <Box sx={{ padding: 2, textAlign: "center" }}>
              <Grid container spacing={2} justifyContent="center">
                <Grid size={12}>
                  <Typography variant="h2">{t("gamemode.results")}</Typography>
                </Grid>
                {dataResult && (
                  <>
                    {dataResult.hasrecord ? (
                      <Grid
                        size={12}
                        sx={{
                          color: Colors.correctanswer,
                          textAlign: "center",
                        }}
                      >
                        <Typography
                          variant="h2"
                          textAlign="center"
                          sx={{ fontSize: important(px(45)) }}
                        >
                          {t("commun.win")}
                        </Typography>
                        <Typography>{t("commun.newrecord")}</Typography>
                      </Grid>
                    ) : (
                      <Grid
                        size={12}
                        sx={{ color: Colors.wronganswer, textAlign: "center" }}
                      >
                        <Typography
                          variant="h2"
                          textAlign="center"
                          sx={{ fontSize: important(px(45)) }}
                        >
                          {t("commun.loose")}
                        </Typography>
                        <Typography>{t("commun.norecordbroken")}</Typography>
                      </Grid>
                    )}
                    <Grid size={12}>
                      <MyExperienceSoloBlock
                        xp={{
                          match: 50,
                          record: dataResult.hasrecord ? 100 : undefined,
                        }}
                      />
                    </Grid>
                    {dataResult.hasrecord && (
                      <Grid
                        sx={{ display: "flex", justifyContent: "center" }}
                        size={12}
                      >
                        <AddMoneyBlock money={100} variant="h4" width={25} />
                      </Grid>
                    )}
                  </>
                )}
                <Grid
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    flexDirection: "column",
                  }}
                >
                  {dataResult?.result.score && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: 1,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography variant="subtitle1">
                        {t("gamemode.record")} :
                      </Typography>
                      <Typography
                        variant="h3"
                        color="primary"
                        sx={{ fontWeight: "bold" }}
                      >
                        {dataResult?.result.score}
                      </Typography>
                    </Box>
                  )}
                  <Box
                    sx={{
                      display: "flex",
                      gap: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="subtitle1">
                      {t("gamemode.score")} :
                    </Typography>
                    <Typography
                      variant="h3"
                      color="primary"
                      sx={{ fontWeight: "bold" }}
                    >
                      {score}
                    </Typography>
                    {dataResult?.previousScore && (
                      <ChangeNumberBlock
                        value={score}
                        previous={dataResult?.previousScore.score}
                        variant="h6"
                      />
                    )}
                  </Box>
                </Grid>
                {numberToGuess && (
                  <>
                    <Grid size={12}>
                      <Typography>
                        {t("gamemode.numbermemory.number")}
                      </Typography>
                      <DiffViewer
                        source={numberToGuess}
                        target={numberToGuess}
                      />
                    </Grid>
                    <Grid size={12}>
                      <Typography>
                        {t("gamemode.numbermemory.answer")}
                      </Typography>
                      {answer.length > 0 ? (
                        <DiffViewer source={numberToGuess} target={answer} />
                      ) : (
                        "-"
                      )}
                    </Grid>
                  </>
                )}
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.colorApp}
                    label={t("commun.replay")}
                    variant="contained"
                    onClick={reset}
                  />
                </Grid>
                <Grid size={12}>
                  <ButtonColor
                    value={Colors.red}
                    label={t("commun.leave")}
                    variant="contained"
                    onClick={() => navigate(-1)}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}

interface DiffViewerProps {
  source: number | string;
  target: number | string;
}

const DiffViewer = ({ source, target }: DiffViewerProps) => {
  const sourceStr = source.toString();
  const targetStr = target.toString();

  return (
    <Box>
      {targetStr.split("").map((char, index) => {
        const isDifferent = char !== sourceStr[index];

        return (
          <Typography
            key={index}
            component="span"
            variant="body1"
            sx={{
              fontSize: "30px !important",
              color: isDifferent ? Colors.red : "inherit",
            }}
          >
            {char}
          </Typography>
        );
      })}
    </Box>
  );
};
