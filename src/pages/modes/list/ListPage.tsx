import { Container, InputBase, Paper, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { selectListAnswerByListId, selectListById } from "src/api/list";
import { CardAnswerList } from "src/component/card/CardList";
import {
  TextNameBlock,
  TextQuestionBlock,
} from "src/component/language/TextLanguageBlock";
import { TitleBlock } from "src/component/title/Title";
import {
  List,
  ListAnswer,
  ListAnswerPlay,
  OrderList,
  TypeList,
} from "src/models/List";
import { compareString } from "src/utils/string";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import { px } from "csx";
import { shuffle } from "lodash";
import moment from "moment";
import { ButtonColor } from "src/component/Button";
import { LogoIcon } from "src/icons/LogoIcon";
import { Colors } from "src/style/Colors";

enum Status {
  NOTSTART = "NOTSTART",
  PROGRESS = "PROGRESS",
  FINISH = "FINISH",
}

export default function ListPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const [statusGame, setStatusGame] = useState<Status>(Status.NOTSTART);
  const [time, setTime] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState<null | boolean>(null);
  const [attempts, setAttempts] = useState(0);
  const [answer, setAnswer] = useState<string>("");
  const [list, setList] = useState<List | null>(null);
  const [answers, setAnswers] = useState<Array<ListAnswerPlay>>([]);
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);

  const formattedTime = useMemo(() => {
    return moment.utc(time * 1000).format("mm:ss");
  }, [time]);

  const findItems = useMemo(
    () => [...answers].filter((el) => el.hasAnswer).length,
    [answers],
  );

  useEffect(() => {
    if (id) {
      selectListById(id).then((resList) => {
        const list: List | null = resList.data;
        const type = list ? list.type : TypeList.TEXT;
        const order = list && list.order ? list.order : OrderList.DESC;
        setList(list);
        selectListAnswerByListId(id).then(({ data }) => {
          const res: Array<ListAnswer> = data ?? [];
          setTotal(res.length);
          const answersSort = orderAnswers(res, type, order);
          setAnswers(
            [...answersSort].map((el) => ({ ...el, hasAnswer: false })),
          );
        });
      });
    }
  }, [id]);

  useEffect(() => {
    if (statusGame !== Status.PROGRESS) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [statusGame]);

  useEffect(() => {
    const allFound = answers.length > 0 && answers.every((a) => a.hasAnswer);

    if (allFound && statusGame !== Status.FINISH) {
      setScore(answers.length);
      setStatusGame(Status.FINISH);
    }
  }, [answers, statusGame]);

  const startGame = () => {
    setAttempts(0);
    setTime(0);
    setCorrectAnswer(null);
    setAnswer("");
    setAnswers((prev) => prev.map((a) => ({ ...a, hasAnswer: false })));
    setStatusGame(Status.PROGRESS);
  };

  const cancel = () => {
    setStatusGame(Status.FINISH);
    setScore(findItems);
  };

  const validateAnswer = (event: React.FormEvent<HTMLFormElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAttempts((prev) => prev++);
    let bestMatch: { id: number; score: number } | null = null;

    answers.forEach((listAnswer) => {
      listAnswer.listanswertranslation.forEach((translation) => {
        const score = compareString(answer, translation.name);
        if (score > 0.8) {
          if (!bestMatch || score > bestMatch.score) {
            bestMatch = {
              id: listAnswer.id,
              score,
            };
          }
        }
      });
    });

    if (bestMatch) {
      setAnswers((prevAnswers) =>
        prevAnswers.map((item) =>
          item.id === bestMatch!.id ? { ...item, hasAnswer: true } : item,
        ),
      );
      setCorrectAnswer(true);
    } else {
      setCorrectAnswer(false);
    }
    setAttempts((prev) => prev + 1);
    setAnswer("");
  };

  const quit = () => {
    navigate(-1);
  };

  const colorBorder = useMemo(() => {
    let res: string = Colors.waitanswerborder;
    if (correctAnswer === true) {
      res = Colors.correctanswerborder;
    } else if (correctAnswer === false) {
      res = Colors.wronganswerborder;
    }
    return res;
  }, [correctAnswer]);

  const orderAnswers = (
    answers: Array<ListAnswer>,
    type: TypeList,
    order = OrderList.DESC,
  ) => {
    let result = [...answers];
    if (type === TypeList.NUMBER) {
      console.log(order);
      const asc = (a: ListAnswer, b: ListAnswer) =>
        Number(a.value) - Number(b.value);
      const desc = (a: ListAnswer, b: ListAnswer) =>
        Number(b.value) - Number(a.value);
      result = [...answers].sort(order === OrderList.DESC ? desc : asc);
    } else if (type === TypeList.IMAGE) {
      result = shuffle([...answers]);
    } else if (type === TypeList.DATE) {
      result = [...answers];
    }
    return result;
  };

  return (
    <Container maxWidth="sm">
      <Grid container>
        <Helmet>
          <title>{`${t("pages.lists.title")} - ${t("appname")}`}</title>
        </Helmet>
        <Grid size={12}>
          <Box sx={{ p: 2 }}>
            <Grid container spacing={1}>
              {list && (
                <>
                  <Grid size={12}>
                    <TitleBlock
                      title={
                        <TextNameBlock
                          variant="h2"
                          values={list.listtranslation}
                        />
                      }
                      link="/list"
                    />
                  </Grid>
                  <Grid size={12} sx={{ textAlign: "center" }}>
                    <TextQuestionBlock
                      variant="h4"
                      values={list.listtranslation}
                    />
                  </Grid>
                  <Grid
                    size={12}
                    sx={{
                      position: "sticky",
                      top: 0,
                      pt: 1,
                      pb: 1,
                      backgroundColor: "background.paper",
                    }}
                  >
                    <Grid container spacing={1}>
                      {
                        {
                          NOTSTART: (
                            <>
                              <Grid size={12}>
                                <ButtonColor
                                  value={Colors.colorApp}
                                  label={t("commun.launchgame")}
                                  icon={LogoIcon}
                                  variant="contained"
                                  onClick={startGame}
                                />
                              </Grid>
                              <Grid size={12}>
                                <Typography
                                  variant="h4"
                                  sx={{ textAlign: "center" }}
                                >
                                  <Trans
                                    i18nKey={t("commun.item")}
                                    values={{
                                      count: total,
                                    }}
                                  />
                                </Typography>
                              </Grid>
                            </>
                          ),
                          PROGRESS: (
                            <>
                              <Grid
                                size={12}
                                sx={{
                                  display: "flex",
                                  alignItems: "baseline",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="h2">
                                  {formattedTime}
                                </Typography>
                                <Typography variant="h4">
                                  <Trans
                                    i18nKey={t("commun.attempt")}
                                    values={{
                                      count: attempts,
                                    }}
                                  />
                                </Typography>
                              </Grid>
                              <Grid
                                size={12}
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: px(4),
                                }}
                              >
                                <Paper
                                  component="form"
                                  sx={{
                                    p: px(4),
                                    display: "flex",
                                    alignItems: "center",
                                    border: `2px solid ${colorBorder}`,
                                  }}
                                  onSubmit={validateAnswer}
                                >
                                  <InputBase
                                    sx={{ ml: 1, flex: 1 }}
                                    placeholder="Saisir votre réponse ici"
                                    value={answer}
                                    autoFocus
                                    onChange={(
                                      e: React.ChangeEvent<HTMLInputElement>,
                                    ) => {
                                      setCorrectAnswer(null);
                                      setAnswer(e.target.value);
                                    }}
                                  />
                                  {correctAnswer !== null && (
                                    <>
                                      {correctAnswer ? (
                                        <CheckIcon
                                          sx={{
                                            color: Colors.green,
                                            fontSize: 30,
                                          }}
                                        />
                                      ) : (
                                        <CloseIcon
                                          sx={{
                                            color: Colors.wronganswer,
                                            fontSize: 30,
                                          }}
                                        />
                                      )}
                                    </>
                                  )}
                                </Paper>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <ButtonColor
                                    value={Colors.red}
                                    label={t("commun.cancel")}
                                    icon={CancelIcon}
                                    variant="contained"
                                    onClick={cancel}
                                    typography="h6"
                                    iconSize={20}
                                    sx={{ width: "fit-content" }}
                                  />
                                  <Typography
                                    variant="body1"
                                    sx={{ textAlign: "right" }}
                                  >
                                    <Trans
                                      i18nKey={t("commun.finditem")}
                                      values={{
                                        value: findItems,
                                        total: total,
                                      }}
                                    />
                                  </Typography>
                                </Box>
                              </Grid>
                            </>
                          ),
                          FINISH: (
                            <>
                              <Grid
                                size={12}
                                sx={{
                                  display: "flex",
                                  alignItems: "baseline",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Typography variant="h2">
                                  {formattedTime}
                                </Typography>
                                <Typography variant="h4">
                                  <Trans
                                    i18nKey={t("commun.attempt")}
                                    values={{
                                      count: attempts,
                                    }}
                                  />
                                </Typography>
                              </Grid>
                              <Grid size={12}>
                                <Typography variant="h4">
                                  <Trans
                                    i18nKey={t("commun.finditem")}
                                    values={{
                                      value: score,
                                      total: total,
                                    }}
                                  />
                                </Typography>
                              </Grid>
                              <Grid size={12}>
                                <ButtonColor
                                  value={Colors.red}
                                  label={t("commun.leave")}
                                  icon={CancelIcon}
                                  variant="contained"
                                  onClick={quit}
                                />
                              </Grid>
                            </>
                          ),
                        }[statusGame]
                      }
                    </Grid>
                  </Grid>
                  {answers.map((answer) => (
                    <Grid size={12} key={answer.id}>
                      <CardAnswerList
                        value={answer}
                        showAnswer={statusGame === Status.FINISH}
                        type={list.type}
                      />
                    </Grid>
                  ))}
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}
