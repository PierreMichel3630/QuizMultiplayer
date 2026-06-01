import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Box } from "@mui/material";
import { padding, percent, px } from "csx";
import { Title, TitleProfile } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { TextNameBlock } from "./language/TextLanguageBlock";
import { TitleText } from "./title/Title";

interface PropsBadgeTitle {
  title: Title;
  onClick?: () => void;
}

export const BadgeTitle = ({ title, onClick }: PropsBadgeTitle) => {
  return (
    <Box
      sx={{
        p: padding(3, 10),
        backgroundColor: Colors.colorApp,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        textAlign: "center",
        borderRadius: px(5),
      }}
      onClick={onClick}
    >
      <TextNameBlock
        variant="h6"
        color="text.secondary"
        values={title.titletranslation}
      />
    </Box>
  );
};

interface PropsBadgeTitleProfile {
  onClick?: () => void;
  isSelect?: boolean;
  title: TitleProfile;
}

export const BadgeTitleProfile = ({
  isSelect,
  onClick,
  title,
}: PropsBadgeTitleProfile) => {
  return (
    <Box
      sx={{
        p: padding(3, 10),
        backgroundColor: Colors.colorApp,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        textAlign: "center",
        borderRadius: px(5),
        display: "flex",
        alignItems: "center",
        gap: 1,
        justifyContent: "center",
      }}
      onClick={onClick}
    >
      <TitleText value={title} variant="h6" color="text.secondary" />
      {isSelect && (
        <CheckCircleTwoToneIcon
          sx={{
            color: Colors.green2,
            backgroundColor: "white",
            borderRadius: percent(50),
            zIndex: 2,
          }}
        />
      )}
    </Box>
  );
};
