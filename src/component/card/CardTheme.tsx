import { Box } from "@mui/material";
import { percent, px } from "csx";
import { useNavigate } from "react-router-dom";
import { Theme } from "src/models/Theme";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Colors } from "src/style/Colors";

interface Props {
  theme: Theme;
  link?: string;
}

export const CardTheme = ({ theme, link }: Props) => {
  const navigate = useNavigate();

  const goTheme = () => {
    navigate(link ? link : `/theme/${theme.id}`);
  };

  return (
    <Box
      onClick={() => goTheme()}
      sx={{
        width: percent(100),
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        p: px(5),
        background: "rgba(255,255,255,.15)",
        borderRadius: px(5),
        gap: px(5),
      }}
    >
      <ImageThemeBlock theme={theme} />
      <JsonLanguageBlock
        variant="h6"
        sx={{ textAlign: "center" }}
        value={theme.name}
      />
    </Box>
  );
};

interface PropsCardSelectTheme {
  theme: Theme;
  select: boolean;
  onSelect: () => void;
}

export const CardSelectTheme = ({
  theme,
  select,
  onSelect,
}: PropsCardSelectTheme) => {
  return (
    <Box
      onClick={() => onSelect()}
      sx={{
        width: percent(100),
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        cursor: "pointer",
        p: px(5),
        background: "rgba(255,255,255,.15)",
        borderRadius: px(5),
        gap: px(5),
        position: "relative",
      }}
    >
      {select && (
        <CheckCircleTwoToneIcon
          sx={{
            color: Colors.green2,
            position: "absolute",
            backgroundColor: "white",
            borderRadius: percent(50),
            top: 0,
            right: 0,
            transform: "translate(30%, -30%)",
          }}
        />
      )}
      <ImageThemeBlock theme={theme} />
      <JsonLanguageBlock
        variant="h6"
        sx={{ textAlign: "center" }}
        value={theme.name}
      />
    </Box>
  );
};
