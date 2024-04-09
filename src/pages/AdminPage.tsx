import {
  Avatar,
  Box,
  Chip,
  Grid,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  countQuestionByThemeAndDifficulty,
  deleteQuestionById,
  selectQuestionByThemeAndDifficulty,
  updateQuestion,
} from "src/api/question";
import { BasicSearchInput } from "src/component/Input";
import { CardAdminQuestion } from "src/component/card/CardQuestion";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { useApp } from "src/context/AppProvider";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { QuestionAdmin, QuestionUpdate } from "src/models/Question";
import { Theme } from "src/models/Theme";
import { colorDifficulty } from "src/models/enum";
import { Colors } from "src/style/Colors";

export const AdminPage = () => {
  const { t } = useTranslation();

  const { setMessage, setSeverity } = useMessage();
  const { language } = useUser();
  const { themes } = useApp();

  const ITEMPERPAGE = 29;
  const [count, setCount] = useState<null | number>(null);
  const [page, setPage] = useState<number>(1);
  const [theme, setTheme] = useState<Theme>(themes[0]);
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);
  const [question, setQuestion] = useState<QuestionAdmin | undefined>(
    undefined
  );
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState<undefined | string>(undefined);
  const [facile, setFacile] = useState<null | number>(0);
  const [moyen, setMoyen] = useState<null | number>(0);
  const [difficile, setDifficile] = useState<null | number>(0);
  const [impossible, setImpossible] = useState<null | number>(0);

  useEffect(() => {
    setTheme(themes[0]);
  }, [themes]);

  useEffect(() => {
    const getPage = () => {
      selectQuestionByThemeAndDifficulty(
        theme.id,
        page - 1,
        ITEMPERPAGE,
        difficulty
      ).then(({ data }) => {
        setQuestions(data as Array<QuestionAdmin>);
      });
    };
    if (theme) {
      getPage();
    }
  }, [theme, page, ITEMPERPAGE, search, difficulty]);

  useEffect(() => {
    if (theme) {
      countQuestionByThemeAndDifficulty(theme.id, difficulty).then(
        ({ count }) => {
          setPage(1);
          setCount(count);
        }
      );
    }
  }, [theme, search, difficulty]);

  useEffect(() => {
    if (theme) {
      countQuestionByThemeAndDifficulty(theme.id, "FACILE").then(
        ({ count }) => {
          setFacile(count);
        }
      );
      countQuestionByThemeAndDifficulty(theme.id, "MOYEN").then(({ count }) => {
        setMoyen(count);
      });
      countQuestionByThemeAndDifficulty(theme.id, "DIFFICILE").then(
        ({ count }) => {
          setDifficile(count);
        }
      );
      countQuestionByThemeAndDifficulty(theme.id, "IMPOSSIBLE").then(
        ({ count }) => {
          setImpossible(count);
        }
      );
    }
  }, [theme]);

  const modifyQuestion = (value: QuestionUpdate) => {
    updateQuestion(value).then(({ data }) => {
      setQuestions((prev) => [...prev.filter((el) => el.id !== data.id), data]);
    });
  };

  const deleteQuestion = () => {
    if (question) {
      deleteQuestionById(question.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setOpenConfirmModal(false);
          setQuestion(undefined);
        }
      });
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  return (
    <Box sx={{ position: "relative", p: 1, mb: 7 }}>
      <Grid container spacing={1} justifyContent="center">
        {themes.map((el) => (
          <Grid item key={el.id}>
            <Chip
              key={el.id}
              color={theme && theme.id === el.id ? "success" : "default"}
              avatar={<Avatar src={el.image} />}
              label={el.name[language.iso]}
              onClick={() => {
                setPage(1);
                setTheme(el);
              }}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <Stack spacing={2} direction="row" justifyContent="center">
            <Box
              sx={{
                p: 1,
                borderRadius: px(5),
                backgroundColor: colorDifficulty["FACILE"],
                color: Colors.white,
                cursor: "pointer",
                border:
                  difficulty === "FACILE"
                    ? `5px solid ${Colors.green2}`
                    : `5px solid ${colorDifficulty["FACILE"]}`,
              }}
              onClick={() =>
                setDifficulty((prev) =>
                  prev === "FACILE" ? undefined : "FACILE"
                )
              }
            >
              <Typography component="span" variant="h2">
                {facile}
              </Typography>
              <Typography component="span"> FACILE</Typography>
            </Box>
            <Box
              sx={{
                p: 1,
                borderRadius: px(5),
                backgroundColor: colorDifficulty["MOYEN"],
                color: Colors.white,
                cursor: "pointer",
                border:
                  difficulty === "MOYEN"
                    ? `5px solid ${Colors.green2}`
                    : `5px solid ${colorDifficulty["MOYEN"]}`,
              }}
              onClick={() =>
                setDifficulty((prev) =>
                  prev === "MOYEN" ? undefined : "MOYEN"
                )
              }
            >
              <Typography component="span" variant="h2">
                {moyen}
              </Typography>
              <Typography component="span"> MOYEN</Typography>
            </Box>
            <Box
              sx={{
                p: 1,
                borderRadius: px(5),
                backgroundColor: colorDifficulty["DIFFICILE"],
                color: Colors.white,
                cursor: "pointer",
                border:
                  difficulty === "DIFFICILE"
                    ? `5px solid ${Colors.green2}`
                    : `5px solid ${colorDifficulty["DIFFICILE"]}`,
              }}
              onClick={() =>
                setDifficulty((prev) =>
                  prev === "DIFFICILE" ? undefined : "DIFFICILE"
                )
              }
            >
              <Typography component="span" variant="h2">
                {difficile}
              </Typography>
              <Typography component="span"> DIFFICILE</Typography>
            </Box>
            <Box
              sx={{
                p: 1,
                borderRadius: px(5),
                backgroundColor: colorDifficulty["IMPOSSIBLE"],
                color: Colors.white,
                cursor: "pointer",
                border:
                  difficulty === "IMPOSSIBLE"
                    ? `5px solid ${Colors.green2}`
                    : `5px solid ${colorDifficulty["IMPOSSIBLE"]}`,
              }}
              onClick={() =>
                setDifficulty((prev) =>
                  prev === "IMPOSSIBLE" ? undefined : "IMPOSSIBLE"
                )
              }
            >
              <Typography component="span" variant="h2">
                {impossible}
              </Typography>
              <Typography component="span"> IMPOSSIBLE</Typography>
            </Box>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <BasicSearchInput
            label={t("commun.search")}
            value={search}
            clear={() => setSearch("")}
            onChange={(value) => setSearch(value)}
          />
        </Grid>
        {questions
          .sort((a, b) => a.id - b.id)
          .map((question) => (
            <Grid item xs={12} sm={6} md={4} key={question.id}>
              <CardAdminQuestion
                question={question}
                onChange={modifyQuestion}
                onDelete={() => {
                  setQuestion(question);
                  setOpenConfirmModal(true);
                }}
              />
            </Grid>
          ))}
        <Box
          sx={{
            position: "fixed",
            bottom: 80,
            left: 5,
            right: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Pagination
            count={count ? Math.ceil(count / ITEMPERPAGE) : 10}
            page={page}
            onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
              setPage(value)
            }
            variant="outlined"
            shape="rounded"
            sx={{
              backgroundColor: Colors.white,
            }}
          />
        </Box>
      </Grid>
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={deleteQuestion}
      />
    </Box>
  );
};
