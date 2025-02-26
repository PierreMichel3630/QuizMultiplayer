import { Box, Button, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { VoteTheme } from "src/models/Vote";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { padding, px } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  theme: VoteTheme;
  onClick: () => void;
  disabled: boolean;
}

export const CardVoteTheme = ({ theme, onClick, disabled }: Props) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: px(15),
        border: `3px solid ${Colors.blue3}`,
        p: padding(5, 10),
      }}
    >
      <Box>
        <JsonLanguageBlock variant="h2" value={theme.name} />
        <Typography variant="h6">
          {t("commun.vote", { count: theme.vote })}
        </Typography>
      </Box>
      <Button
        variant="contained"
        endIcon={<ThumbUpIcon />}
        color="secondary"
        onClick={onClick}
        sx={{ p: 1, height: "fit-content" }}
        disabled={disabled}
      >
        <Typography variant="h6">{t("commun.vote")}</Typography>
      </Button>
    </Box>
  );
};
