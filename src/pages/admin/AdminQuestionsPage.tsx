import AddIcon from "@mui/icons-material/Add";
import { Box, FormControlLabel, Grid, Pagination, Switch } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
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
import { useMessage } from "src/context/MessageProvider";
import { QuestionAdmin, QuestionUpdate } from "src/models/Question";
import { Colors } from "src/style/Colors";

export default function AdminQuestionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { setMessage, setSeverity } = useMessage();
  const ITEMPERPAGE = 29;
  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(null);
  const [questionsId, setQuestionsId] = useState<string>("");
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);
  const [question, setQuestion] = useState<QuestionAdmin | undefined>(
    undefined
  );
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isImage, setIsImage] = useState(false);

  useEffect(() => {
    const question = searchParams.get("question") as string | null;
    const newPage = searchParams.get("page") as string | null;
    setPage(newPage ? Number(newPage) : 1);
    setQuestionsId(question ?? "");
  }, [searchParams]);

  const getCountQuestion = useCallback(() => {
    countQuestions(questionsId).then(({ count }) => {
      setCount(count ?? 0);
    });
  }, [questionsId]);

  useEffect(() => {
    getCountQuestion();
  }, [getCountQuestion]);

  const getPage = useCallback(() => {
    setQuestion(undefined);
    if (page !== null) {
      selectQuestion(page - 1, ITEMPERPAGE, questionsId, isImage).then(
        ({ data }) => {
          setQuestions(data as Array<QuestionAdmin>);
        }
      );
    }
  }, [isImage, page, questionsId]);

  useEffect(() => {
    getPage();
  }, [page, ITEMPERPAGE, getPage]);

  const modifyQuestion = (value: QuestionUpdate) => {
    updateQuestion(value).then(({ data }) => {
      setQuestions((prev) => [...prev.filter((el) => el.id !== data.id), data]);
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

  return (
    <Box sx={{ position: "relative", p: 1, mb: 7 }}>
      <Grid container spacing={1} justifyContent="center">
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Switch
                checked={isImage}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setIsImage(event.target.checked);
                }}
                name="isimage"
              />
            }
            label={t("commun.questionwithimage")}
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
        {questions.map((question) => (
          <Grid item xs={12} sm={6} md={4} key={question.id}>
            <CardAdminQuestion
              question={question}
              onChange={modifyQuestion}
              onDelete={() => {
                setQuestion(question);
                setOpenConfirmModal(true);
              }}
              onEdit={() => {
                setQuestion(question);
                setOpenModal(true);
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
          {page !== null && (
            <Pagination
              count={count ? Math.ceil(count / ITEMPERPAGE) : 10}
              page={page}
              onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
                navigate(`/administration/question?page=${value}`)
              }
              variant="outlined"
              shape="rounded"
              sx={{
                backgroundColor: Colors.white,
              }}
              boundaryCount={2}
              siblingCount={2}
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
