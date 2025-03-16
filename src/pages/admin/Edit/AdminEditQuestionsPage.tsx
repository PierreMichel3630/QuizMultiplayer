import AddIcon from "@mui/icons-material/Add";
import { Box, FormControlLabel, Grid, Pagination, Switch } from "@mui/material";
import { uniqBy } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  countQuestions,
  deleteQuestionById,
  selectQuestion,
  updateQuestion,
} from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { CardAdminQuestion } from "src/component/card/CardQuestion";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { CreateEditQuestionDialog } from "src/component/modal/CreateEditQuestionDialog";
import { AutocompleteNumber, AutocompleteTheme } from "src/component/Select";
import { useApp } from "src/context/AppProvider";
import { useMessage } from "src/context/MessageProvider";
import { useUser } from "src/context/UserProvider";
import { QuestionAdmin, QuestionUpdate } from "src/models/Question";
import { Theme } from "src/models/Theme";
import { Colors } from "src/style/Colors";
import { sortByName } from "src/utils/sort";

export interface FilterQuestion {
  themes: Array<number>;
  isImage: boolean;
  ids: Array<number>;
  validate: boolean;
  difficulties: Array<string>;
}
export default function AdminEditQuestionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setMessage, setSeverity } = useMessage();
  const { language } = useUser();
  const { themesAdmin } = useApp();

  const ITEMPERPAGE = 29;

  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);
  const [question, setQuestion] = useState<QuestionAdmin | undefined>(
    undefined
  );
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState<FilterQuestion>({
    themes: [],
    isImage: false,
    ids: [],
    validate: true,
    difficulties: [],
  });

  const themesUniq = useMemo(
    () =>
      uniqBy(themesAdmin, (el) => el.id).sort((a, b) =>
        sortByName(language, a, b)
      ),
    [themesAdmin, language]
  );

  useEffect(() => {
    const question = searchParams.get("question") as string | null;
    const newPage = searchParams.get("page") as string | null;
    const idthemes = searchParams.get("themes") as string | null;
    setPage(newPage ? Number(newPage) : 1);
    setFilter((prev) => ({
      ...prev,
      ids: question ? question.split(",").map((el) => Number(el)) : [],
      themes: idthemes ? idthemes.split(",").map((el) => Number(el)) : [],
    }));
  }, [searchParams, themesUniq]);

  const getCountQuestion = useCallback(() => {
    countQuestions(filter).then(({ count }) => {
      setCount(count ?? 0);
    });
  }, [filter]);

  useEffect(() => {
    getCountQuestion();
  }, [getCountQuestion]);

  const getPage = useCallback(() => {
    setQuestions([]);
    setQuestion(undefined);
    if (page !== null) {
      selectQuestion(page - 1, ITEMPERPAGE, filter).then(({ data }) => {
        const result = data
          ? data.map((el) => ({ ...el.question, theme: el.theme }))
          : [];
        setQuestions(result);
      });
    }
  }, [filter, page]);

  useEffect(() => {
    getPage();
  }, [page, ITEMPERPAGE, getPage]);

  const modifyQuestion = (value: QuestionUpdate) => {
    updateQuestion(value).then(({ data }) => {
      if (data !== null) {
        setQuestions((prev) => {
          const res = [...prev].filter((el) => el.id !== value.id);
          return [...res, data];
        });
      }
    });
  };

  const deleteQuestion = () => {
    if (question) {
      deleteQuestionById(question.id).then((res) => {
        setQuestion(undefined);
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setOpenConfirmModal(false);
          getPage();
        }
      });
    } else {
      setSeverity("error");
      setMessage(t("commun.error"));
    }
  };

  const themes = useMemo(() => {
    const ids = [...filter.themes];
    return themesUniq.filter((el) => ids.includes(el.id));
  }, [filter, themesUniq]);

  return (
    <Box sx={{ position: "relative", p: 1, mb: 7 }}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={filter.isImage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFilter((prev) => ({
                    ...prev,
                    isImage: event.target.checked,
                  }));
                }}
              />
            }
            label={t("commun.image")}
          />
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Switch
                checked={filter.validate}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setFilter((prev) => ({
                    ...prev,
                    validate: event.target.checked,
                  }));
                }}
              />
            }
            label={t("commun.validate")}
          />
        </Grid>
        <Grid item xs={12}>
          <AutocompleteTheme
            value={themes}
            onChange={(value: Array<Theme>) => {
              const ids = value.map((el) => el.id);
              navigate(`/administration/question?page=1&themes=${ids}`);
            }}
            isAdmin
          />
        </Grid>
        <Grid item xs={12}>
          <AutocompleteNumber
            label={t("commun.searchid")}
            value={filter.ids}
            onChange={(value) => setFilter((prev) => ({ ...prev, ids: value }))}
          />
        </Grid>
        <Grid item xs={12}>
          <ButtonColor
            icon={AddIcon}
            label={t("commun.addquestion")}
            value={Colors.green}
            onClick={() => setOpenModal(true)}
            variant="contained"
          />
        </Grid>
        {questions.map((question, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <CardAdminQuestion
              question={question}
              onChange={modifyQuestion}
              onDelete={() => {
                setQuestion(question);
                setOpenConfirmModal(true);
              }}
              onEdit={() => navigate(`/administration/question/${question.id}`)}
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
          {page !== null && (
            <Pagination
              count={count ? Math.ceil(count / ITEMPERPAGE) : 1}
              page={page}
              onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
                navigate(
                  `/administration/question?page=${value}&themes=${filter.themes}`
                )
              }
              variant="outlined"
              shape="rounded"
              sx={{
                backgroundColor: "background.paper",
              }}
            />
          )}
        </Box>
      </Grid>
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={deleteQuestion}
      />
      <CreateEditQuestionDialog
        question={question}
        open={openModal}
        close={() => {
          setQuestion(undefined);
          getPage();
          setOpenModal(false);
        }}
      />
    </Box>
  );
}
