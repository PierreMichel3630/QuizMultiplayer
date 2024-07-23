import { Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { selectQuestionById } from "src/api/question";
import { deleteResponseById, selectResponseByType } from "src/api/response";
import { QuestionForm } from "src/form/QuestionForm";
import { QuestionAdmin } from "src/models/Question";
import { ResponseUpdate } from "src/models/Response";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ButtonColor } from "src/component/Button";
import AddIcon from "@mui/icons-material/Add";
import { Colors } from "src/style/Colors";
import { CreateEditResponseDialog } from "src/component/modal/CreateEditResponseDialog";

export default function AdminQuestionPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  const [question, setQuestion] = useState<QuestionAdmin | undefined>(
    undefined
  );
  const [responses, setResponses] = useState<Array<ResponseUpdate>>([]);
  const [response, setResponse] = useState<ResponseUpdate | undefined>(
    undefined
  );
  const [openModalResponse, setOpenModalResponse] = useState(false);

  useEffect(() => {
    const getQuestion = () => {
      if (id) {
        selectQuestionById(Number(id)).then(({ data }) => {
          setQuestion(data as QuestionAdmin);
        });
      }
    };
    getQuestion();
  }, [id]);

  const getResponse = useCallback(() => {
    if (question && question.typeResponse) {
      selectResponseByType(question.typeResponse).then(({ data }) => {
        setResponses(data as Array<ResponseUpdate>);
      });
    }
  }, [question]);

  useEffect(() => {
    getResponse();
  }, [getResponse]);

  const deleteResponse = (response: ResponseUpdate) => {
    deleteResponseById(response.id).then(() => {
      getResponse();
    });
  };
  const editResponse = (response: ResponseUpdate) => {
    setResponse(response);
    setOpenModalResponse(true);
  };

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <Divider>
          <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
            {`${t("commun.question")} `}
          </Typography>
        </Divider>
      </Grid>
      {question && (
        <Grid item xs={12}>
          <QuestionForm validate={close} question={question} />
        </Grid>
      )}
      {question && question.typeResponse && (
        <>
          <Grid item xs={12}>
            <Divider>
              <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                {t("commun.possibleresponses")}
              </Typography>
            </Divider>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} justifyContent="center">
              {responses.map((response) => (
                <Grid item xs={12} key={response.id}>
                  <Paper sx={{ p: 1 }}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs>
                        <Typography variant="h6">
                          {response.value["fr-FR"]}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => editResponse(response)}>
                          <EditIcon />
                        </IconButton>
                      </Grid>
                      <Grid item>
                        <IconButton onClick={() => deleteResponse(response)}>
                          <DeleteIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12}>
                <ButtonColor
                  icon={AddIcon}
                  label={t("commun.addresponse")}
                  value={Colors.green}
                  onClick={() => setOpenModalResponse(true)}
                  variant="contained"
                />
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
      {question && question.typeResponse && (
        <CreateEditResponseDialog
          open={openModalResponse}
          close={() => {
            getResponse();
            setOpenModalResponse(false);
          }}
          response={response}
          type={question.typeResponse}
        />
      )}
    </Grid>
  );
}
