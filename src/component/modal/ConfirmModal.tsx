import { Button, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  title: string;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({ open, title, onClose, onConfirm }: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{title}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={onClose}
              color="error"
              startIcon={<CancelIcon />}
            >
              {t("commun.no")}
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="contained"
              onClick={onConfirm}
              color="success"
              startIcon={<CheckIcon />}
            >
              {t("commun.yes")}
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
