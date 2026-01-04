import {
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { ResponseForm, ResponseImageForm } from "src/form/ResponseForm";
import { ResponseImageUpdate, ResponseUpdate } from "src/models/Response";
import CloseIcon from "@mui/icons-material/Close";

interface Props {
  type: string;
  response: ResponseUpdate | undefined;
  open: boolean;
  close: () => void;
}

export const CreateEditResponseDialog = ({
  response,
  type,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open} fullWidth fullScreen={true}>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {response ? t("commun.editresponse") : t("commun.addresponse")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <ResponseForm type={type} response={response} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

interface PropsImage {
  type: string;
  response: ResponseImageUpdate | undefined;
  open: boolean;
  close: () => void;
}

export const CreateEditResponseImageDialog = ({
  response,
  type,
  open,
  close,
}: PropsImage) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open} fullWidth fullScreen>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {response ? t("commun.editresponse") : t("commun.addresponse")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid size={12}>
            <ResponseImageForm
              type={type}
              response={response}
              validate={close}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
