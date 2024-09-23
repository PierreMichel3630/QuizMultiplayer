import BoltIcon from "@mui/icons-material/Bolt";
import { Box } from "@mui/material";
import { px } from "csx";
import { useNavigate } from "react-router-dom";
import { Category } from "src/models/Category";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

interface Props {
  category: Category;
  link?: string;
  width?: number;
}

export const CardCategory = ({ category, link, width = 90 }: Props) => {
  const navigate = useNavigate();

  const goCategory = () => {
    navigate(link ? link : `/category/${category.id}`);
  };

  return (
    <Box
      onClick={() => goCategory()}
      sx={{
        width: width,
        display: "flex",
        justifyContent: "flex-start",
        flexDirection: "column",
        cursor: "pointer",
        background: "rgba(255,255,255,.15)",
        borderRadius: px(10),
        gap: px(2),
      }}
    >
      <Box
        sx={{
          backgroundColor: Colors.blue3,
          width: width,
          aspectRatio: "1/1",
          borderRadius: px(5),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <BoltIcon
          sx={{ width: px(width - 10), height: px(width - 10), color: "white" }}
        />
      </Box>
      <JsonLanguageBlock
        variant="h6"
        sx={{ textAlign: "center" }}
        value={category.name}
      />
    </Box>
  );
};
