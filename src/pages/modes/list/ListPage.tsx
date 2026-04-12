import { Container, InputBase, Paper, Typography } from "@mui/material";
import { Box, Grid } from "@mui/system";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import {
  saveScoreList,
  selectListAnswerByListId,
  selectListById,
  selectListScoreByListIdAndProfile,
} from "src/api/list";
import { CardAnswerList, CardRecordList } from "src/component/card/CardList";
import {
  TextNameBlock,
  TextQuestionBlock,
} from "src/component/language/TextLanguageBlock";
import { TitleBlock } from "src/component/title/Title";
import {
  List,
  ListAnswer,
  ListAnswerPlay,
  ListScore,
  ResultScoreList,
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
import { DialogResultListModal } from "src/component/modal/ListModal";
import { RankingListMode } from "src/component/ranking/list/RankingListMode";
import { SkeletonRectangulars } from "src/component/skeleton/SkeletonRectangular";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { LogoIcon } from "src/icons/LogoIcon";
import { Colors } from "src/style/Colors";
import { Order } from "src/models/enum/Order";

enum StatusGame {
  NOTSTART = "NOTSTART",
  PROGRESS = "PROGRESS",
  FINISH = "FINISH",
}

enum AnswerStatus {
  CORRECT = "CORRECT",
  WRONG = "WRONG",
  ALREADYANSWER = "ALREADYANSWER",
}

interface BestMatch {
  id: number;
  score: number;
  response: string;
  hasAnswer: boolean;
}

export interface ResultGameList {
  score: number;
  attempts: number;
  time: number;
}

export default function ListPage() {
  const { t } = useTranslation();
  const { language } = useUser();
  const { profile } = useAuth();
  const { id } = useParams();

  const answerRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const stickyRef = useRef<HTMLDivElement | null>(null);

  const [statusGame, setStatusGame] = useState<StatusGame>(StatusGame.NOTSTART);
  const [time, setTime] = useState(0);
  const [correctAnswer, setCorrectAnswer] = useState<null | AnswerStatus>(null);
  const [attempts, setAttempts] = useState(0);
  const [answer, setAnswer] = useState<string>("");
  const [list, setList] = useState<List | null>(null);
  const [answers, setAnswers] = useState<Array<ListAnswerPlay>>([]);
  const [total, setTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [myScore, setMyScore] = useState<null | ListScore>(null);

  const [openResult, setOpenResult] = useState(false);
  const [dataResult, setDataResult] = useState<null | ResultScoreList>(null);
  const [result, setResult] = useState<ResultGameList | null>(null);

  const formattedTime = useMemo(() => {
    return moment.utc(time).format("mm:ss");
  }, [time]);

  const findItems = useMemo(
    () => [...answers].filter((el) => el.hasAnswer).length,
    [answers],
  );

  const getMyScore = useCallback(() => {
    if (id && profile) {
      selectListScoreByListIdAndProfile(id, profile.id).then(({ data }) => {
        setMyScore(data);
      });
    }
  }, [id, profile]);

  useEffect(() => {
    getMyScore();
  }, [getMyScore]);

  useEffect(() => {
    if (id) {
      selectListById(id).then((resList) => {
        const list: List | null = resList.data;
        const type = list ? list.type : TypeList.TEXT;
        const order = list?.order ? list.order : Order.DESC;
        setList(list);
        selectListAnswerByListId(id).then(({ data }) => {
          const res: Array<ListAnswer> = data ?? [];
          setTotal(res.length);
          const answersSort = orderAnswers(res, type, order, list?.format);
          setAnswers(
            [...answersSort].map((el) => ({ ...el, hasAnswer: false })),
          );
          setLoading(false);
        });
      });
    }
  }, [id]);

  useEffect(() => {
    if (statusGame !== StatusGame.PROGRESS) return;

    const interval = setInterval(() => {
      setTime((prev) => prev + 100);
    }, 100);

    return () => clearInterval(interval);
  }, [statusGame]);

  useEffect(() => {
    const allFound = answers.length > 0 && answers.every((a) => a.hasAnswer);

    if (allFound && statusGame !== StatusGame.FINISH) {
      setScore(answers.length);
      if (profile && id) {
        setResult({
          score: answers.length,
          time,
          attempts,
        });
        setOpenResult(true);
        saveScoreList(answers, time, attempts, Number(id)).then(({ data }) => {
          setDataResult(data);
        });
      }
      setStatusGame(StatusGame.FINISH);
    }
  }, [answers, attempts, id, profile, statusGame, time]);

  const startGame = () => {
    setAttempts(0);
    setTime(0);
    setCorrectAnswer(null);
    setAnswer("");
    setAnswers((prev) => prev.map((a) => ({ ...a, hasAnswer: false })));
    setStatusGame(StatusGame.PROGRESS);
  };

  const cancel = () => {
    setStatusGame(StatusGame.FINISH);
    setScore(findItems);
    if (profile && id) {
      setResult({
        score: findItems,
        time,
        attempts,
      });
      setOpenResult(true);
      saveScoreList(answers, time, attempts, Number(id)).then(({ data }) => {
        setDataResult(data);
      });
    }
  };

  const validateAnswer = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();

      setAnswers((prevAnswers) => {
        let bestMatch: BestMatch | undefined = undefined;

        prevAnswers.forEach((listAnswer) => {
          const translation = [...listAnswer.listanswertranslation].find(
            (el) => el.language.id === language?.id,
          );
          if (translation) {
            const score = Math.max(
              compareString(answer, translation.name),
              ...translation.othername.map((n) => compareString(answer, n)),
            );
            if (score > 0.8) {
              if (
                !bestMatch ||
                bestMatch.hasAnswer ||
                score > bestMatch.score
              ) {
                bestMatch = {
                  id: listAnswer.id,
                  score,
                  response: translation.name,
                  hasAnswer: listAnswer.hasAnswer,
                };
              }
            }
          }
        });

        if (!bestMatch) {
          setCorrectAnswer(AnswerStatus.WRONG);
          return prevAnswers;
        }

        const { id, response, hasAnswer } = bestMatch;

        let ids: Array<number> = [];

        if (hasAnswer) {
          setCorrectAnswer(AnswerStatus.ALREADYANSWER);
        } else {
          setCorrectAnswer(AnswerStatus.CORRECT);
          ids = prevAnswers
            .filter((el) =>
              el.listanswertranslation.some(
                (translation) =>
                  translation.name === response &&
                  translation.language.id === language?.id,
              ),
            )
            .map((answer) => answer.id);
        }

        const element = answerRefs.current[id];
        if (element && stickyRef.current) {
          const stickyHeight = stickyRef.current.offsetHeight;

          const y =
            element.getBoundingClientRect().top +
            window.pageYOffset -
            stickyHeight;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }

        return prevAnswers.map((item) =>
          ids.includes(item.id) ? { ...item, hasAnswer: true } : item,
        );
      });

      setAttempts((prev) => prev + 1);
      setAnswer("");
    },
    [answer, language],
  );

  const quit = () => {
    setAnswers((prev) => prev.map((a) => ({ ...a, hasAnswer: false })));
    setStatusGame(StatusGame.NOTSTART);
    getMyScore();
  };

  const colorBorder = useMemo(() => {
    let res: string = Colors.waitanswerborder;
    switch (correctAnswer) {
      case AnswerStatus.CORRECT:
        res = Colors.correctanswerborder;
        break;
      case AnswerStatus.WRONG:
        res = Colors.wronganswerborder;
        break;
      case AnswerStatus.ALREADYANSWER:
        res = Colors.sameanswerborder;
        break;
    }
    return res;
  }, [correctAnswer]);

  const orderAnswers = (
    answers: Array<ListAnswer>,
    type: TypeList,
    order = Order.DESC,
    format?: string,
  ) => {
    let result = [...answers];
    if (type === TypeList.NUMBER) {
      const asc = (a: ListAnswer, b: ListAnswer) =>
        Number(a.value) - Number(b.value);
      const desc = (a: ListAnswer, b: ListAnswer) =>
        Number(b.value) - Number(a.value);
      result = [...answers].sort(order === Order.DESC ? desc : asc);
    } else if (type === TypeList.IMAGE) {
      result = shuffle([...answers]);
    } else if (type === TypeList.DATE) {
      const hasDash = format?.includes("-");
      if (hasDash) {
        const formatSplit = format?.split("-")[0];
        const asc = (a: ListAnswer, b: ListAnswer) =>
          moment(a.value.split("-")[0], formatSplit, true).valueOf() -
          moment(b.value.split("-")[0], formatSplit, true).valueOf();
        const desc = (a: ListAnswer, b: ListAnswer) =>
          moment(b.value.split("-")[0], formatSplit, true).valueOf() -
          moment(a.value.split("-")[0], formatSplit, true).valueOf();
        result = [...answers].sort(order === Order.DESC ? desc : asc);
      } else {
        const asc = (a: ListAnswer, b: ListAnswer) =>
          moment(a.value, format, true).valueOf() -
          moment(b.value, format, true).valueOf();
        const desc = (a: ListAnswer, b: ListAnswer) =>
          moment(b.value, format, true).valueOf() -
          moment(a.value, format, true).valueOf();
        result = [...answers].sort(order === Order.DESC ? desc : asc);
      }
    }
    return result;
  };

  return (
    <Container maxWidth="md">
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
                  {loading ? (
                    <SkeletonRectangulars number={20} height={25} />
                  ) : (
                    <>
                      <Grid
                        size={12}
                        ref={stickyRef}
                        sx={{
                          position: "sticky",
                          top: 0,
                          pt: 1,
                          pb: 1,
                          backgroundColor: "background.paper",
                          zIndex: 1000
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
                                          {
                                            {
                                              CORRECT: (
                                                <CheckIcon
                                                  sx={{
                                                    color: Colors.green,
                                                    fontSize: 30,
                                                  }}
                                                />
                                              ),
                                              WRONG: (
                                                <CloseIcon
                                                  sx={{
                                                    color: Colors.wronganswer,
                                                    fontSize: 30,
                                                  }}
                                                />
                                              ),
                                              ALREADYANSWER: (
                                                <Box
                                                  sx={{
                                                    color: Colors.sameanswer,
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    lineHeight: 1,
                                                  }}
                                                >
                                                  <Typography
                                                    component="span"
                                                    sx={{
                                                      fontSize: 30,
                                                      lineHeight: 1,
                                                      display: "inline",
                                                    }}
                                                  >
                                                    =
                                                  </Typography>
                                                </Box>
                                              ),
                                            }[correctAnswer]
                                          }
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
                      {statusGame === StatusGame.NOTSTART ? (
                        <>
                          {myScore && (
                            <Grid size={12}>
                              <CardRecordList score={myScore} total={total} />
                            </Grid>
                          )}
                          {list && total > 0 && (
                            <Grid size={12}>
                              <RankingListMode list={list} totalList={total} />
                            </Grid>
                          )}
                        </>
                      ) : (
                        <>
                          {answers.map((answer) => (
                            <Grid
                              size={{ xs: 12, sm: 6 }}
                              key={answer.id}
                              ref={(el: HTMLDivElement | null) => {
                                answerRefs.current[answer.id] = el;
                              }}
                            >
                              <CardAnswerList
                                value={answer}
                                showAnswer={statusGame === StatusGame.FINISH}
                                type={list.type}
                              />
                            </Grid>
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <DialogResultListModal
        open={openResult}
        data={dataResult}
        total={total}
        result={result}
        handleClose={() => {
          setOpenResult(false);
        }}
        retry={() => {
          setOpenResult(false);
          startGame();
        }}
      />
    </Container>
  );
}
