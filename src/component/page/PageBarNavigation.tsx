import { Box } from "@mui/system";
import { BarNavigation } from "../navigation/BarNavigation";
import { useNavigate } from "react-router-dom";

interface Props {
  title?: string;
  content?: JSX.Element;
  children: string | JSX.Element | JSX.Element[];
}

export const PageBarNavigation = ({ title, content, children }: Props) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <BarNavigation
        title={title}
        content={content}
        quit={() => navigate(-1)}
      />
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
