import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { TitleForm } from "src/form/admin/TitleForm";
import { Title } from "src/models/Title";

interface Props {
  title: Title | null;
  open: boolean;
  close: () => void;
}

export const CreateEditTitleDialog = ({ title, open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid sx={{ textAlign: "center" }} size={12}>
            <Typography variant="h2">
              {title ? t("commun.edittitle") : t("commun.addtitle")}
            </Typography>
          </Grid>
          <Grid size={12}>
            <TitleForm title={title} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
