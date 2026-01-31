import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";

interface Props {
  title: string;
  text?: string;
  extra?: JSX.Element;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ConfirmDialog = ({
  open,
  title,
  text,
  extra,
  onClose,
  onConfirm,
}: Props) => {
  const { t } = useTranslation();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent sx={{ p: 2 }}>
        <Grid container spacing={1}>
          <Grid sx={{ textAlign: "center" }} size={12}>
            <Typography variant="h2">{title}</Typography>
          </Grid>
          {text && (
            <Grid size={12}>
              <Alert severity="warning">
                <Typography variant="h6">{text}</Typography>
              </Alert>
            </Grid>
          )}
          {extra && (
            <Grid size={12}>
              {extra}
            </Grid>
          )}
          <Grid size={6}>
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
          <Grid size={6}>
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
