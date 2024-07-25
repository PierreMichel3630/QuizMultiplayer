import {
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  MenuItem,
  TextField,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { important } from "csx";
import { useState } from "react";
import { insertReport } from "src/api/report";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useMessage } from "src/context/MessageProvider";
import { DuelGame } from "src/models/DuelGame";
import { SoloGame } from "src/models/Game";
import { Question } from "src/models/Question";
import { ReportInsert } from "src/models/Report";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { CardSignalQuestion } from "../card/CardQuestion";

interface Props {
  open: boolean;
  close: () => void;
  question?: Question;
  sologame?: SoloGame;
  duelgame?: DuelGame;
}

export const ReportModal = ({
  open,
  close,
  question,
  sologame,
  duelgame,
}: Props) => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { setMessage, setSeverity } = useMessage();
  const { reportmessages } = useApp();
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const changeType = (event: React.ChangeEvent<HTMLInputElement>) => {
    setType(event.target.value);
  };

  const changeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.target.value as string);
  };

  const validate = () => {
    if (type !== "") {
      const reportInsert: ReportInsert = {
        description: description,
        message: Number(type),
        question: question ? question.id : null,
        profile: user ? user.id : null,
        sologame: sologame ? sologame.id : null,
        duelgame: duelgame ? duelgame.id : null,
        questionjson: question,
      };
      insertReport(reportInsert).then(({ error }) => {
        if (error) {
          setMessage(t("commun.error"));
          setSeverity("error");
        } else {
          setMessage(t("alert.addreport"));
          setSeverity("success");
          setDescription("");
          setType("");
          close();
        }
      });
    }
  };

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar sx={{ minHeight: important("auto") }}>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.reportquestion")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ backgroundColor: Colors.black, p: 1 }}>
        <Grid container spacing={3}>
          {question && (
            <Grid item xs={12}>
              <CardSignalQuestion question={question} />
            </Grid>
          )}
          <Grid item xs={12}>
            <TextField
              id="select-type"
              select
              label={t("commun.typeproblem")}
              placeholder={t("commun.typeproblem")}
              fullWidth
              sx={{
                color: important(Colors.white),
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: important(Colors.white),
                },
                "& .MuiInputBase-input": {
                  color: Colors.white,
                },
                "& .Mui-focused": {
                  color: Colors.white,
                },
                "& .MuiInputLabel-root": {
                  color: important(Colors.white),
                },
                "& .MuiSelect-icon": {
                  color: Colors.white,
                },
              }}
              helperText={type === "" && t("commun.selecttypeerror")}
              onChange={changeType}
            >
              {reportmessages.map((message) => (
                <MenuItem key={message.id} value={message.id}>
                  <JsonLanguageBlock value={message.message} />
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label={t("commun.descriptionerror")}
              placeholder={t("commun.placeholderdescriptionerror")}
              multiline
              fullWidth
              rows={4}
              value={description}
              onChange={changeDescription}
              sx={{
                color: important(Colors.white),
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: important(Colors.white),
                },
                "& .MuiOutlinedInput-root": {
                  color: Colors.white,
                },
                "& .Mui-focused": {
                  color: Colors.white,
                },
                "& .MuiInputLabel-root": {
                  color: important(Colors.white),
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonColor
              value={Colors.green}
              label={t("commun.validate")}
              icon={DoneOutlineIcon}
              onClick={() => validate()}
              variant="contained"
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
