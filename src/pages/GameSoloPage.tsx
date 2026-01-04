import { Box, Container, Divider, Grid } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, useParams } from "react-router-dom";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { Colors } from "src/style/Colors";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { selectSoloGameById } from "src/api/game";
import { ButtonColor } from "src/component/Button";
import { BarNavigation } from "src/component/navigation/BarNavigation";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { SkeletonQuestion } from "src/component/skeleton/SkeletonQuestion";
import { SoloGame } from "src/models/Game";
import { QuestionResult, QuestionResultV1 } from "src/models/Question";

export default function GameSoloPage() {
  const { t } = useTranslation();
  const { uuid } = useParams();
  const navigate = useNavigate();

  const [game, setGame] = useState<undefined | SoloGame>(undefined);
  const [questions, setQuestions] = useState<
    Array<QuestionResult | QuestionResultV1>
  >([]);
  const [maxIndex, setMaxIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnd, setIsEnd] = useState(false);

  useEffect(() => {
    const getGame = () => {
      if (uuid) {
        selectSoloGameById(uuid).then(({ data }) => {
          if (data) {
            const soloGame = data as SoloGame;
            setGame(soloGame);
            const questions =
              data.version === 1
                ? (data.questions as Array<QuestionResultV1>)
                : (data.questions as Array<QuestionResult>);

            setQuestions(questions);

            const questionsMap = [...soloGame.questions]
              .splice(0, 3)
              .filter((el) => el.typequestion === "MAPPOSITION");
            setMaxIndex(questionsMap.length === 3 ? 3 : 5);
          }
        });
      }
    };
    getGame();
  }, [uuid]);

  useEffect(() => {
    const handleScroll = () => {
      if (!isEnd) {
        setIsLoading(true);
        if (
          window.innerHeight + document.documentElement.scrollTop + 400 <=
          document.documentElement.offsetHeight
        ) {
          return;
        }
        setMaxIndex((prev) => prev + 3);
      }
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd]);

  const questionsDisplay = useMemo(() => {
    const allquestions = [...questions].reverse();
    const newQuestion = [...allquestions].splice(0, maxIndex);
    setIsLoading(false);
    setIsEnd(newQuestion.length >= allquestions.length);
    return newQuestion;
  }, [questions, maxIndex]);

  return (
    <Grid container className="page" alignContent="flex-start">
      <Helmet>
        <title>{`${t("commun.sologame")} - ${t("appname")}`}</title>
      </Helmet>
      <BarNavigation title={t("commun.sologame")} quit={() => navigate(-1)} />
      <Grid item xs={12}>
        <Container maxWidth="md">
          <Box
            sx={{
              p: 1,
              mb: px(60),
            }}
          >
            {game && (
              <Grid container spacing={1}>
                <Grid item xs={12} sx={{ mb: 1 }}>
                  <ScoreThemeBlock theme={game.theme} score={game.points} />
                </Grid>
                {questionsDisplay.map((el, index) => (
                  <Fragment key={index}>
                    <Grid item xs={12}>
                      <CardSignalQuestion
                        question={el}
                        version={game.version}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Divider
                        sx={{
                          borderBottomWidth: 5,
                          borderColor: Colors.white,
                          borderRadius: px(5),
                        }}
                      />
                    </Grid>
                  </Fragment>
                ))}
                {!isEnd && isLoading && (
                  <>
                    {Array.from(new Array(1)).map((_, index) => (
                      <Fragment key={index}>
                        <Grid item xs={12}>
                          <SkeletonQuestion />
                        </Grid>
                        <Grid item xs={12}>
                          <Divider
                            sx={{
                              borderBottomWidth: 5,
                              borderColor: Colors.white,
                              borderRadius: px(5),
                            }}
                          />
                        </Grid>
                      </Fragment>
                    ))}
                  </>
                )}
              </Grid>
            )}
          </Box>
        </Container>
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              flexDirection: "column",
            }}
          >
            <ButtonColor
              value={Colors.blue}
              label={t("commun.return")}
              icon={KeyboardReturnIcon}
              onClick={() => navigate(-1)}
              variant="contained"
            />
          </Box>
        </Container>
      </Box>
    </Grid>
  );
}
