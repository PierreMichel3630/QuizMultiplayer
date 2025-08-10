import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

import CancelIcon from "@mui/icons-material/Cancel";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";

interface PropsGoBackButtonIcon {
  link?: string;
}
export const GoBackButtonIcon = ({ link }: PropsGoBackButtonIcon) => {
  const navigate = useNavigate();

  return (
    <Box
      onClick={() => (link ? navigate(link) : navigate(-1))}
      sx={{ cursor: "pointer", display: "flex" }}
    >
      <KeyboardArrowLeftIcon fontSize="large" />
    </Box>
  );
};

export const QuitHomeButton = () => {
  const navigate = useNavigate();

  return (
    <Box onClick={() => navigate("/")} sx={{ cursor: "pointer" }}>
      <CancelIcon fontSize="large" />
    </Box>
  );
};
