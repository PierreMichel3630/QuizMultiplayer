import { Divider, Grid, IconButton, Paper, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteQuestionById,
  deleteQuestionThemeById,
  insertQuestionTheme,
  selectQuestionById,
  selectQuestionThemeByQuestion,
} from "src/api/question";
import {
  deleteResponseById,
  deleteResponseImageById,
  selectResponseByType,
  selectResponseImageByType,
} from "src/api/response";
import { QuestionForm } from "src/form/QuestionForm";
import { QuestionAdmin } from "src/models/Question";
import { ResponseImageUpdate, ResponseUpdate } from "src/models/Response";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ButtonColor } from "src/component/Button";
import AddIcon from "@mui/icons-material/Add";
import { Colors } from "src/style/Colors";
import {
  CreateEditResponseDialog,
  CreateEditResponseImageDialog,
} from "src/component/modal/CreateEditResponseDialog";
import { QuestionTheme, Theme } from "src/models/Theme";
import { ImageThemeBlock } from "src/component/ImageThemeBlock";
import { JsonLanguageBlock } from "src/component/JsonLanguageBlock";
import { AutocompleteInputTheme } from "src/component/Autocomplete";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { ImageQuestionBlock } from "src/component/ImageBlock";
import { px } from "csx";
import { sortByUsValue } from "src/utils/sort";

export default function AdminQuestionPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [question, setQuestion] = useState<QuestionAdmin | undefined>(
    undefined
  );
  const [responses, setResponses] = useState<Array<ResponseUpdate>>([]);
  const [response, setResponse] = useState<ResponseUpdate | undefined>(
    undefined
  );
  const [responsesImage, setResponsesImage] = useState<
    Array<ResponseImageUpdate>
  >([]);
  const [responseImage, setResponseImage] = useState<
    ResponseImageUpdate | undefined
  >(undefined);
  const [questionThemes, setQuestionThemes] = useState<Array<QuestionTheme>>(
    []
  );
  const [openModalResponse, setOpenModalResponse] = useState(false);
  const [openModalResponseImage, setOpenModalResponseImage] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const getQuestion = useCallback(() => {
    if (id) {
      selectQuestionById(Number(id)).then(({ data }) => {
        setQuestion(data as QuestionAdmin);
      });
    }
  }, [id]);

  useEffect(() => {
    getQuestion();
  }, [getQuestion]);

  const getThemes = useCallback(() => {
    if (id) {
      selectQuestionThemeByQuestion(Number(id)).then(({ data }) => {
        setQuestionThemes(data as Array<QuestionTheme>);
      });
    }
  }, [id]);

  useEffect(() => {
    getThemes();
  }, [getThemes]);

  const getResponse = useCallback(() => {
    if (
      question &&
      question.typeResponse &&
      question.typequestion === "DEFAULT"
    ) {
      selectResponseByType(question.typeResponse).then(({ data }) => {
        setResponses((data as Array<ResponseUpdate>).sort(sortByUsValue));
      });
    }
  }, [question]);

  useEffect(() => {
    getResponse();
  }, [getResponse]);

  const getResponseImage = useCallback(() => {
    if (
      question &&
      question.typeResponse &&
      question.typequestion === "IMAGE"
    ) {
      selectResponseImageByType(question.typeResponse).then(({ data }) => {
        setResponsesImage(
          (data as Array<ResponseImageUpdate>).sort(sortByUsValue)
        );
      });
    }
  }, [question]);

  useEffect(() => {
    getResponseImage();
  }, [getResponseImage]);

  const deleteResponse = (response: ResponseUpdate) => {
    deleteResponseById(response.id).then(() => {
      getResponse();
    });
  };
  const editResponse = (response: ResponseUpdate) => {
    setResponse(response);
    setOpenModalResponse(true);
  };

  const deleteResponseImage = (response: ResponseImageUpdate) => {
    deleteResponseImageById(response.id).then(() => {
      getResponse();
    });
  };
  const editResponseImage = (response: ResponseImageUpdate) => {
    setResponseImage(response);
    setOpenModalResponseImage(true);
  };

  const deleteTheme = (id: number) => {
    deleteQuestionThemeById(id).then(() => {
      getThemes();
    });
  };

  const insertTheme = (theme: Theme) => {
    if (question) {
      const value = { theme: theme.id, question: question.id };
      insertQuestionTheme(value).then(() => {
        getThemes();
      });
    }
  };

  const deleteQuestion = () => {
    if (question) {
      deleteQuestionById(question.id).then(() => {
        navigate(-1);
      });
    }
  };

  return (
    <Grid container spacing={1} justifyContent="center" sx={{ mt: 2, mb: 2 }}>
      {question && (
        <Grid item xs={12}>
          <QuestionForm validate={close} question={question} />
        </Grid>
      )}

      <Grid item xs={12} sx={{ mt: 1 }}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
      <Grid item xs={12} sx={{ textAlign: "center" }}>
        <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
          {t("commun.themes")}
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <AutocompleteInputTheme
          placeholder={t("commun.selecttheme")}
          onSelect={(newvalue) => insertTheme(newvalue)}
        />
      </Grid>
      <Grid item xs={12}>
        <Grid container spacing={1}>
          {questionThemes.map((el) => (
            <Grid item xs={12} key={el.id}>
              <Paper sx={{ p: 1 }}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item>
                    <ImageThemeBlock theme={el.theme} size={50} />
                  </Grid>
                  <Grid item xs>
                    <JsonLanguageBlock value={el.theme.name} />
                  </Grid>
                  <Grid item>
                    <IconButton onClick={() => deleteTheme(el.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Grid>
      {question && question.typeResponse && (
        <>
          {question.typequestion === "IMAGE" ? (
            <>
              <Grid item xs={12} sx={{ mt: 1 }}>
                <Divider sx={{ borderBottomWidth: 5 }} />
              </Grid>
              <Grid item xs={12} sx={{ textAlign: "center" }}>
                <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                  {t("commun.possibleresponses")}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={1} justifyContent="center">
                  {responsesImage.map((response) => (
                    <Grid item xs={12} key={response.id}>
                      <Paper sx={{ p: 1 }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item sx={{ height: px(60) }}>
                            <ImageQuestionBlock src={response.image} />
                          </Grid>
                          <Grid item xs>
                            <Typography variant="h6">
                              {response.response["fr-FR"]}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              onClick={() => editResponseImage(response)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Grid>
                          <Grid item>
                            <IconButton
                              onClick={() => deleteResponseImage(response)}
                            >
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
                      onClick={() => setOpenModalResponseImage(true)}
                      variant="contained"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          ) : (
            question.typequestion === "DEFAULT" && (
              <>
                <Grid item xs={12} sx={{ mt: 1 }}>
                  <Divider sx={{ borderBottomWidth: 5 }} />
                </Grid>
                <Grid item xs={12} sx={{ textAlign: "center" }}>
                  <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
                    {t("commun.possibleresponses")}
                  </Typography>
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
                              <IconButton
                                onClick={() => editResponse(response)}
                              >
                                <EditIcon />
                              </IconButton>
                            </Grid>
                            <Grid item>
                              <IconButton
                                onClick={() => deleteResponse(response)}
                              >
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
            )
          )}
        </>
      )}
      <Grid item xs={12}>
        <ButtonColor
          value={Colors.red}
          label={t("commun.delete")}
          icon={DeleteIcon}
          variant="contained"
          onClick={() => setOpenConfirmModal(true)}
        />
      </Grid>
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
      {question && question.typeResponse && (
        <CreateEditResponseImageDialog
          open={openModalResponseImage}
          close={() => {
            getResponseImage();
            setOpenModalResponseImage(false);
          }}
          response={responseImage}
          type={question.typeResponse}
        />
      )}
      <ConfirmDialog
        title={t("modal.delete")}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        onConfirm={deleteQuestion}
      />
    </Grid>
  );
}
