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

import CloseIcon from "@mui/icons-material/Close";
import { ProposeThemeForm } from "src/form/ProposeThemeForm";

interface Props {
  open: boolean;
  close: () => void;
}

export const ProposeThemeModal = ({ open, close }: Props) => {
  const { t } = useTranslation();

  return (
    <Dialog onClose={close} open={open} maxWidth="sm" fullWidth>
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.proposetheme")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ProposeThemeForm validate={close} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
