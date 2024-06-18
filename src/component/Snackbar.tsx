import {
  Alert,
  AlertColor,
  Snackbar,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";

interface Props {
  message: string;
  open: boolean;
  handleClose: () => void;
  severity?: AlertColor;
  autoHideDuration?: number;
  sx?: SxProps<Theme>;
}
export const MessageSnackbar = ({
  open,
  message,
  handleClose,
  severity = "error",
  autoHideDuration = 6000,
  sx,
}: Props) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      sx={sx}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        <Typography variant="body1">{message}</Typography>
      </Alert>
    </Snackbar>
  );
};
