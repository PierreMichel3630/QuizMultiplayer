import {
  AppBar,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useTranslation } from "react-i18next";

import CloseIcon from "@mui/icons-material/Close";
import { ProposeQuestionForm } from "src/form/ProposeQuestionForm";
import { Theme } from "src/models/Theme";

interface Props {
  open: boolean;
  close: () => void;
  theme: Theme;
}

export const ProposeQuestionModal = ({ theme, open, close }: Props) => {
  const { t } = useTranslation();
  const themeMui = useTheme();
  const fullScreen = useMediaQuery(themeMui.breakpoints.down("md"));

  return (
    <Dialog
      onClose={close}
      open={open}
      maxWidth="lg"
      fullWidth
      fullScreen={fullScreen}
      sx={{ backgroundColor: "inherit" }}
    >
      <AppBar sx={{ position: "relative" }}>
        <Toolbar>
          <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
            {t("commun.proposequestion")}
          </Typography>
          <IconButton color="inherit" onClick={close} aria-label="close">
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <DialogContent>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <ProposeQuestionForm validate={close} theme={theme} />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
