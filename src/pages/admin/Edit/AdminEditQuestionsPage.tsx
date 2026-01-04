import AddIcon from "@mui/icons-material/Add";
import { Box, Grid, Pagination } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  countQuestions,
  deleteQuestionById,
  selectQuestion,
} from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { ICardImage } from "src/component/card/CardImage";
import { CardAdminQuestion } from "src/component/card/CardQuestion";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { CreateEditQuestionDialog } from "src/component/modal/CreateEditQuestionDialog";
import { AutocompleteTheme } from "src/component/Select";
import { useMessage } from "src/context/MessageProvider";
import { QuestionAdmin } from "src/models/Question";
import { Colors } from "src/style/Colors";

export interface FilterQuestion {
  theme?: number;
  ids: Array<number>;
}
export default function AdminEditQuestionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setMessage, setSeverity } = useMessage();

  const ITEMPERPAGE = 29;

  const [themes, setThemes] = useState<Array<ICardImage>>([]);
  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);
  const [question, setQuestion] = useState<QuestionAdmin | undefined>(
    undefined
  );
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [filter, setFilter] = useState<FilterQuestion>({
    theme: undefined,
    ids: [],
  });

  useEffect(() => {
    const question = searchParams.get("ids") as string | null;
    const newPage = searchParams.get("page") as string | null;
    const idtheme = searchParams.get("theme") as string | null;
    setPage(newPage ? Number(newPage) : 1);
    setFilter((prev) => ({
      ...prev,
      ids: question ? question.split(",").map((el) => Number(el)) : [],
      theme: idtheme ? Number(idtheme) : undefined,
    }));
  }, [searchParams]);

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
        setQuestions(data ?? []);
      });
    }
  }, [filter, page]);

  useEffect(() => {
    getPage();
  }, [page, ITEMPERPAGE, getPage]);

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

  return (
    <Box sx={{ position: "relative", p: 1, mb: 7 }}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12}>
          <AutocompleteTheme
            value={themes}
            onChange={(value) => {
              setThemes(value);
              if (value.length > 0) {
                const id = value[0].id;
                navigate(`/administration/edit/questions?page=1&theme=${id}`);
              } else {
                navigate(`/administration/edit/questions?page=1`);
              }
            }}
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
            <CardAdminQuestion question={question} refresh={getPage} />
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
                  `/administration/edit/questions?page=${value}&theme=${filter.theme}`
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
