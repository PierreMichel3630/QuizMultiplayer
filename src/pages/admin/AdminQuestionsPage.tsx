import { Box, FormControlLabel, Grid, Pagination, Switch } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { countQuestions, selectQuestion } from "src/api/question";
import { ICardImage } from "src/component/card/CardImage";
import { CardAdminQuestion } from "src/component/card/CardQuestion";
import { AutocompleteNumber, AutocompleteTheme } from "src/component/Select";
import { QuestionAdmin } from "src/models/Question";

export interface FilterQuestion {
  themes: Array<number>;
  isImage: boolean;
  ids: Array<number>;
  validate: boolean;
  difficulties: Array<string>;
}
export default function AdminQuestionsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ITEMPERPAGE = 29;

  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Array<QuestionAdmin>>([]);
  const [filter, setFilter] = useState<FilterQuestion>({
    themes: [],
    isImage: false,
    ids: [],
    validate: true,
    difficulties: [],
  });
  const [themes] = useState<Array<ICardImage>>([]);

  useEffect(() => {
    const question = searchParams.get("question");
    const newPage = searchParams.get("page");
    const idthemes = searchParams.get("themes");
    setPage(newPage ? Number(newPage) : 1);
    setFilter((prev) => ({
      ...prev,
      ids: question ? question.split(",").map((el) => Number(el)) : [],
      themes: idthemes ? idthemes.split(",").map((el) => Number(el)) : [],
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
            onChange={(value) => {
              const ids = value.map((el) => el.id);
              navigate(`/administration/edit/questions?page=1&themes=${ids}`);
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <AutocompleteNumber
            label={t("commun.searchid")}
            value={filter.ids}
            onChange={(value) => setFilter((prev) => ({ ...prev, ids: value }))}
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
                  `/administration/edit/questions?page=${value}&themes=${filter.themes}`
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
    </Box>
  );
}
