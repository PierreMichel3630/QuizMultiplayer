import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { AnimationBlock } from "../animation/AnimationBlock";
import duelAnimate from "src/assets/animation/duel.json";
import { useNavigate } from "react-router-dom";
import { Colors } from "src/style/Colors";

export const ChallengeButton = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Box
      onClick={() => navigate("/challenge")}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 1,
        cursor: "pointer",
        "--border-angle": "0deg",
        borderRadius: "12px",
        boxShadow: "0px 2px 4px hsl(0 0% 0% / 25%)",
        animation: "border-angle-rotate 2s infinite linear",
        border: "5px solid transparent",
        position: "relative",
        background: `linear-gradient(${Colors.black}, ${Colors.black}) padding-box, conic-gradient(from var(--border-angle),oklch(100% 100% 0deg),oklch(100% 100% 45deg),oklch(100% 100% 90deg),oklch(100% 100% 135deg),oklch(100% 100% 180deg),oklch(100% 100% 225deg),oklch(100% 100% 270deg),oklch(100% 100% 315deg),oklch(100% 100% 360deg)) border-box`,
      }}
    >
      <AnimationBlock width={35} height={35} data={duelAnimate} />
      <Typography variant="h4" sx={{ color: Colors.white }}>
        {t("commun.gotochallenge")}
      </Typography>
    </Box>
  );
};
