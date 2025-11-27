import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";
import { px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Answer } from "src/models/Answer";
import { Language } from "src/models/Language";
import { Colors } from "src/style/Colors";
import { ImageQCMBlock } from "../ImageBlock";

interface PropsCardAdminTitle {
  answer: Answer;
  language: Language;
  onEdit: () => void;
  onDelete?: () => void;
  isCorrect?: boolean;
}

export const CardAdminAnswer = ({
  answer,
  language,
  onEdit,
  onDelete,
  isCorrect = false,
}: PropsCardAdminTitle) => {
  const { t } = useTranslation();

  const translation = useMemo(() => {
    const translations = [...answer.answertranslation];
    const translation = translations.find(
      (el) => el.language.id === language.id
    );

    return translation ?? undefined;
  }, [answer, language]);

  return (
    <Paper
      sx={{ p: 1, border: isCorrect ? `4px solid ${Colors.green}` : "primary" }}
    >
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          {answer.image ? (
            <Box sx={{ height: px(150) }}>
              <ImageQCMBlock src={answer.image} />
            </Box>
          ) : (
            <>
              <Typography variant={translation ? "h4" : "caption"}>
                {translation ? translation.label : t("commun.totranslation")}
              </Typography>
              {translation && translation.otherlabel.length > 0 && (
                <Box>
                  <Typography variant="body1" component="span">
                    {t("commun.otherresponse")}
                  </Typography>
                  <Typography variant="body1" component="span">
                    {translation.otherlabel.join(", ")}
                  </Typography>
                </Box>
              )}
            </>
          )}
        </Grid>

        <Grid item>
          <IconButton aria-label="edit" onClick={onEdit}>
            <EditIcon />
          </IconButton>
        </Grid>
        {onDelete && (
          <Grid item>
            <IconButton aria-label="delete" onClick={onDelete}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
