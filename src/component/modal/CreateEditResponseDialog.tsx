import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { ResponseForm } from "src/form/ResponseForm";
import { ResponseUpdate } from "src/models/Response";

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
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">
              {response ? t("commun.editresponse") : t("commun.addresponse")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <ResponseForm type={type} response={response} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
