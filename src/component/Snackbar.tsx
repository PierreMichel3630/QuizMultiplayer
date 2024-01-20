import { Alert, AlertColor, Snackbar, Typography } from "@mui/material";

interface Props {
  message: string;
  open: boolean;
  handleClose: () => void;
  severity?: AlertColor;
  autoHideDuration?: number;
}
export const MessageSnackbar = ({
  open,
  message,
  handleClose,
  severity = "error",
  autoHideDuration = 6000,
}: Props) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        <Typography variant="body1">{message}</Typography>
      </Alert>
    </Snackbar>
  );
};
