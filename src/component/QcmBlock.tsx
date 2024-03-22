import { Grid, Paper, Typography } from "@mui/material";
import { ResponseLanguageString, ResponseSolo } from "src/models/Response";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";

interface Props {
  responses: Array<ResponseLanguageString>;
  onSubmit: (value: string) => void;
}

export const QcmBlock = ({ responses, onSubmit }: Props) => {
  const { language } = useUser();
  return (
    <Grid container spacing={1}>
      {responses.map((response, index) => (
        <Grid item xs={12} key={index}>
          <Paper
            sx={{
              p: 1,
              cursor: "pointer",
              display: "flex",
              gap: 2,
              alignItems: "center",
            }}
            onClick={() => onSubmit(response[language.iso])}
          >
            <Typography variant="h6">{index + 1} .</Typography>
            <JsonLanguageBlock variant="h4" value={response} />
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};

interface PropsResponse {
  responses: Array<ResponseLanguageString>;
  response: ResponseSolo;
}

export const QcmResponseBlock = ({ responses, response }: PropsResponse) => {
  const { language } = useUser();
  const value = response.response[language.iso]
    ? response.response[language.iso]
    : response.response["fr-FR"];

  return (
    <Grid container spacing={1}>
      {responses.map((r, index) => {
        const isCorrectResponse = Array.isArray(value)
          ? value.includes(r[language.iso])
          : value === r[language.iso];
        const isMyAnswer = response.answer === r[language.iso];
        return (
          <Grid item xs={12} key={index}>
            <Paper
              sx={{
                p: 1,
                display: "flex",
                gap: 2,
                alignItems: "center",
                backgroundColor: isCorrectResponse
                  ? Colors.green
                  : isMyAnswer
                  ? Colors.red
                  : "primary.main",
              }}
            >
              <Typography variant="h6">{index + 1} .</Typography>
              <JsonLanguageBlock variant="h4" value={r} />
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
};
