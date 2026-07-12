import { Box, Grid, Alert, Divider, Container } from "@mui/material";
import { percent, px } from "csx";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ButtonColor } from "src/component/Button";
import { CardSignalQuestion } from "src/component/card/CardQuestion";
import { ReportModal } from "src/component/modal/ReportModal";
import { TrainingGame } from "src/models/Game";
import { QuestionResult } from "src/models/Question";
import { Colors } from "src/style/Colors";

import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { PREFIX_LOCALSTORAGE_GAME } from "src/utils/config";
import { HeaderTrainingGame } from "./HeaderTrainingGame";
import { Profile } from "src/models/Profile";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { TextNameBlock } from "src/component/language/TextLanguageBlock";

interface Props {
  isAllQuestion?: boolean;
  game?: TrainingGame;
  goodAnswer: number;
  badAnswer: number;
  profile: Profile | null;
}

export const EndTrainingGameBlock = ({
  game,
  isAllQuestion = false,
  goodAnswer,
  badAnswer,
  profile,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const localStorageId = useMemo(
    () => `${PREFIX_LOCALSTORAGE_GAME}${game?.uuid}`,
    [game],
  );

  const [maxIndex, setMaxIndex] = useState(5);
  const [questionReport, setQuestionReport] = useState<
    undefined | QuestionResult
  >(undefined);

  const questions = useMemo(
    () => JSON.parse(localStorage.getItem(localStorageId) ?? "[]"),
    [localStorageId],
  );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
          document.documentElement.offsetHeight ||
        questions.length <= maxIndex
      ) {
        return;
      }
      setMaxIndex((prev) => prev + 2);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [questions, maxIndex]);

  const questionsDisplay = useMemo(() => {
    return [...questions].splice(0, maxIndex);
  }, [questions, maxIndex]);

  return (
    <Box sx={{ display: "flex", width: percent(100), mb: 6 }}>
      <Grid container spacing={1}>
        <Grid size={12}>
          <HeaderTrainingGame
            profile={profile}
            goodAnswer={goodAnswer}
            badAnswer={badAnswer}
          />
        </Grid>
        {game?.theme && (
          <Grid
            size={12}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <ImageThemeBlock theme={game.theme} size={30} />

            <TextNameBlock variant="h4" values={game.theme.themetranslation} />
          </Grid>
        )}
        {isAllQuestion && (
          <Grid size={12}>
            <Alert severity="warning" sx={{ width: percent(100) }}>
              {t("alert.allresponseanswer")}
            </Alert>
          </Grid>
        )}
        <Grid size={12}>
          <Grid container spacing={1}>
            {questionsDisplay.map((el, index) => (
              <Fragment key={index}>
                <Grid size={12}>
                  <CardSignalQuestion
                    question={el}
                    report={() => setQuestionReport(el)}
                  />
                </Grid>
                <Grid size={12}>
                  <Divider
                    sx={{
                      borderBottomWidth: 5,
                      borderRadius: px(5),
                    }}
                  />
                </Grid>
              </Fragment>
            ))}
          </Grid>
        </Grid>
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <Container
            maxWidth="md"
            sx={{
              backgroundColor: "background.paper",
            }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 1,
                p: 1,
                flexDirection: "column",
              }}
            >
              <ButtonColor
                value={Colors.red}
                label={t("commun.leave")}
                icon={ExitToAppIcon}
                onClick={() => {
                  localStorage.removeItem(localStorageId);
                  if (game) {
                    navigate(`/theme/${game.theme.id}`);
                  } else {
                    navigate("/");
                  }
                }}
                variant="contained"
              />
            </Box>
          </Container>
        </Box>
      </Grid>
      <ReportModal
        open={questionReport !== undefined}
        close={() => setQuestionReport(undefined)}
        question={questionReport}
      />
    </Box>
  );
};
