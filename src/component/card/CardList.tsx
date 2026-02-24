import { Box, Divider, Grid, Paper, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import {
  ListAnswer,
  ListAnswerPlay,
  ListScore,
  ListTranslation,
  TypeList,
} from "src/models/List";
import { Colors } from "src/style/Colors";
import { ImageCard } from "../image/ImageCard";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";

import { green } from "@mui/material/colors";
import ListMode from "src/assets/mode/list.png";

interface Props {
  value: ListTranslation;
}

export const CardList = ({ value }: Props) => {
  const { t } = useTranslation();

  const image = useMemo(
    () => ({
      image: ListMode,
      color: green["A400"],
    }),
    [],
  );

  return (
    <Link to={`/list/${value.list.id}`} style={{ textDecoration: "none" }}>
      <Paper
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
        elevation={8}
      >
        <ImageCard value={image} size={50} />
        <Box>
          <Typography variant="h4">{value.name}</Typography>
          <Typography>
            <Trans
              i18nKey={t("commun.item")}
              values={{
                count: value.list.elements,
              }}
            />
          </Typography>
        </Box>
      </Paper>
    </Link>
  );
};

interface PropsCardAnswerList {
  value: ListAnswerPlay;
  showAnswer?: boolean;
  type?: TypeList;
}

export const CardAnswerList = ({
  value,
  type,
  showAnswer = false,
}: PropsCardAnswerList) => {
  const { language } = useUser();

  const answer = useMemo(() => {
    let result = undefined;
    if (language) {
      const translation = [...value.listanswertranslation].find(
        (el) => el.language.id === language.id,
      );
      result = translation ?? [...value.listanswertranslation][0];
    }
    return result;
  }, [language, value]);

  return (
    answer && (
      <Paper
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          height: percent(100),
          minHeight: px(40),
        }}
        elevation={8}
      >
        {value.image && (
          <Box sx={{ width: px(70), display: "flex" }}>
            <img
              src={value.image}
              data-src={value.image}
              loading="lazy"
              style={{
                maxHeight: percent(100),
                maxWidth: percent(100),
                objectFit: "contain",
                backgroundColor: Colors.grey2,
                outline: "2px solid black",
              }}
            />
          </Box>
        )}
        <Typography
          variant="h2"
          sx={{
            color: value.hasAnswer ? Colors.correctanswer : Colors.wronganswer,
          }}
        >
          {value.hasAnswer || showAnswer ? answer.name : ""}
        </Typography>
        <ValueAnswerList value={value} type={type} />
      </Paper>
    )
  );
};

interface PropsValueAnswerList {
  value: ListAnswer;
  type?: TypeList;
}

export const ValueAnswerList = ({ value, type }: PropsValueAnswerList) => {
  const label = useMemo(() => {
    let result = undefined;
    if (type === TypeList.DATE) {
      result = value.value;
    } else if (type === TypeList.NUMBER) {
      result = Number(value.value).toLocaleString();
    }
    return result;
  }, [type, value.value]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        alignItems: "baseline",
      }}
    >
      <Typography variant="h4" component="span">
        {label}
      </Typography>
      {value.unit && (
        <Typography variant="h4" component="span">
          {value.unit}
        </Typography>
      )}
    </Box>
  );
};

interface PropsCardRecordList {
  score: ListScore;
  total: number;
}
export const CardRecordList = ({ score, total }: PropsCardRecordList) => {
  const { t } = useTranslation();

  const isSame = useMemo(
    () =>
      score.attempts_recordattempts === score.attempts_recordtime &&
      score.time_recordattempts === score.time_recordtime,
    [score],
  );
  return (
    <Paper elevation={8} sx={{ overflow: "hidden" }}>
      <Grid container>
        <Grid
          size={12}
          sx={{
            backgroundColor: Colors.grey,
            p: padding(5, 20),
            display: "flex",
            gap: 1,
            alignItems: "center",
          }}
        >
          <Typography variant="h4" textAlign="center">
            {t("commun.mybestscore")}
          </Typography>
        </Grid>
        <Grid size={12} sx={{ p: padding(10, 5) }}>
          <Grid container spacing={1}>
            <Grid size={12}>
              <Typography variant="h2" textAlign="center">
                <Trans
                  i18nKey={t("commun.finditem")}
                  values={{
                    value: score.result,
                    total: total,
                  }}
                />
              </Typography>
            </Grid>
            {isSame ? (
              <>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <QuestionMarkIcon />
                  <Typography variant="h4">
                    <Trans
                      i18nKey={t("commun.attempt")}
                      values={{
                        count: score.attempts_recordattempts,
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <AccessTimeIcon />
                  <Typography variant="h4">
                    {(score.time_recordattempts / 1000).toFixed(2)}s
                  </Typography>
                </Grid>
              </>
            ) : (
              <>
                <Grid size={12}>
                  <Typography variant="h6" textAlign="center">
                    {t("commun.mybestscoretime")}
                  </Typography>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <QuestionMarkIcon />
                  <Typography variant="h4">
                    <Trans
                      i18nKey={t("commun.attempt")}
                      values={{
                        count: score.attempts_recordtime,
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <AccessTimeIcon />
                  <Typography variant="h4">
                    {(score.time_recordtime / 1000).toFixed(2)}s
                  </Typography>
                </Grid>
                <Grid size={12}>
                  <Divider />
                </Grid>
                <Grid size={12}>
                  <Typography variant="h6" textAlign="center">
                    {t("commun.mybestscoreattempts")}
                  </Typography>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <QuestionMarkIcon />
                  <Typography variant="h4">
                    <Trans
                      i18nKey={t("commun.attempt")}
                      values={{
                        count: score.attempts_recordattempts,
                      }}
                    />
                  </Typography>
                </Grid>
                <Grid
                  size={6}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 1,
                  }}
                >
                  <AccessTimeIcon />
                  <Typography variant="h4">
                    {(score.time_recordattempts / 1000).toFixed(2)}s
                  </Typography>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
