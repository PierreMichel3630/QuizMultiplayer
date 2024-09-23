import { Box, Grid, Pagination, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Theme } from "src/models/Theme";

import VisibilityIcon from "@mui/icons-material/Visibility";
import { percent, px } from "csx";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { countQuestionsAdmin, selectImageQuestion } from "src/api/question";
import { ButtonColor } from "src/component/Button";
import { ImageQuestionBlock } from "src/component/ImageBlock";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";
import { FilterQuestion } from "./AdminQuestionsPage";

export interface FilterGameAdmin {
  type: "ALL" | "DUEL" | "SOLO";
  themes: Array<Theme>;
  player?: Profile;
  opponent?: Profile;
}
export interface QuestionImage {
  id: number;
  image: string;
}

export default function AdminImagesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const ITEMPERPAGE = 600;

  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number | null>(null);
  const [questions, setQuestions] = useState<Array<QuestionImage>>([]);
  const [filter, setFilter] = useState<FilterQuestion>({
    themes: [],
    isImage: true,
    ids: [],
    validate: true,
    difficulties: [],
  });

  useEffect(() => {
    const newPage = searchParams.get("page") as string | null;
    setPage(newPage ? Number(newPage) : 1);
  }, [searchParams]);

  const getCountQuestion = useCallback(() => {
    countQuestionsAdmin(filter).then(({ count }) => {
      setCount(count ?? 0);
    });
  }, [filter]);

  useEffect(() => {
    getCountQuestion();
  }, [getCountQuestion]);

  useEffect(() => {
    setQuestions([]);
    if (page !== null) {
      selectImageQuestion(page, ITEMPERPAGE).then(({ data }) => {
        setQuestions(data as Array<QuestionImage>);
      });
    }
  }, [page]);

  useEffect(() => {
    setQuestions([]);
    if (page !== null) {
      selectImageQuestion(page, ITEMPERPAGE).then(({ data }) => {
        setQuestions(data as Array<QuestionImage>);
      });
    }
  }, [page]);

  /*const loadIssueImage = () => {
    const nbPage = Math.ceil(count / ITEMPERPAGE);
    const promises = [];
    for (let i = 0; i <= nbPage; i++) {
      promises.push(selectImageQuestion(i, ITEMPERPAGE));
    }
    Promise.all(promises).then((res) => {
      const allquestions = res.reduce(
        (acc, v) => [...acc, ...v.data],
        [] as Array<QuestionImage>
      );
      console.log(allquestions);
      testImages(allquestions).then((res) => {
        console.log(res);
      });
    });
  };*/

  return (
    <Grid container spacing={1} sx={{ mb: 6 }}>
      {/*<Grid item xs={12}>
        <ButtonColor
          value={Colors.red}
          label={t("commun.seequestionimageerror")}
          icon={VisibilityIcon}
          variant="contained"
          onClick={() => loadIssueImage()}
        />
      </Grid>*/}
      {questions.map((question, index) => (
        <Grid item xs={12} sm={6} md={3} lg={2} key={index}>
          <Paper
            sx={{
              p: 1,
              height: percent(100),
              position: "relative",
              backgroundColor: Colors.black,
              color: Colors.white,
            }}
            variant="outlined"
          >
            <Grid container spacing={1} justifyContent="center">
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="h4">{question.id}</Typography>
              </Grid>
              <Grid item xs={12} sx={{ height: px(200) }}>
                <ImageQuestionBlock src={question.image} />
              </Grid>
              <Grid item xs={12}>
                <ButtonColor
                  value={Colors.blue}
                  label={t("commun.seequestion")}
                  icon={VisibilityIcon}
                  variant="contained"
                  onClick={() =>
                    navigate(`/administration/question/${question.id}`)
                  }
                />
              </Grid>
            </Grid>
          </Paper>
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
              navigate(`/administration/images?page=${value}`)
            }
            variant="outlined"
            shape="rounded"
            sx={{
              backgroundColor: Colors.white,
            }}
          />
        )}
      </Box>
    </Grid>
  );
}
