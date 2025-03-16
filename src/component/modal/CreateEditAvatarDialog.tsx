import { Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AvatarForm } from "src/form/admin/AvatarForm";
import { Avatar } from "src/models/Avatar";

interface Props {
  avatar?: Avatar;
  open: boolean;
  close: () => void;
}

export const CreateEditAvatarDialog = ({ avatar, open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open}>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">
              {avatar ? t("commun.editavatar") : t("commun.addavatar")}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <AvatarForm avatar={avatar} validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
