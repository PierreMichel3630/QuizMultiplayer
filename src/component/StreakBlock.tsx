import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";

import CheckIcon from "@mui/icons-material/Check";
import { useMemo } from "react";
import moneyIcon from "src/assets/money.svg";
import xpIcon from "src/assets/xp.svg";
import { StreakDayRecompense } from "src/models/Recompense";

interface Props {
  value: number;
  logoSize?: number;
  textSize?: number;
}

export const StreakBlock = ({ value, logoSize = 25, textSize = 18 }: Props) => {
  return (
    <Link to="/streak" style={{ textDecoration: "none" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: px(2),
          borderRadius: px(50),
          backgroundColor: Colors.yellow4,
          border: `3px solid ${Colors.red4}`,
          padding: padding(0, 3),
        }}
      >
        <LocalFireDepartmentIcon
          sx={{ color: Colors.red4, fontSize: logoSize }}
        />
        <Typography
          variant="h4"
          sx={{ color: Colors.red4, pr: px(5), fontSize: textSize }}
        >
          {value}
        </Typography>
      </Box>
    </Link>
  );
};

interface PropsStreakRecompense {
  recompense: StreakDayRecompense;
  streak?: number;
  isLast?: boolean;
}
export const StreakRecompense = ({
  recompense,
  streak = 0,
  isLast = false,
}: PropsStreakRecompense) => {
  const { t } = useTranslation();

  const isValid = useMemo(
    () => (isLast ? false : streak >= recompense.day),
    [streak, recompense.day, isLast]
  );
  return (
    <Box
      sx={{
        border: `1px solid ${Colors.grey2}`,
        borderRadius: px(15),
        textAlign: "center",
        minHeight: px(110),
        height: percent(100),
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          backgroundColor: Colors.grey,
          borderBottom: `1px solid ${Colors.grey2}`,
          display: "flex",
          gap: 1,
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" component="p">
          {t(isLast ? "commun.daysupvalue" : "commun.dayvalue", {
            value: recompense.day,
          })}
        </Typography>
        {isValid && <CheckIcon sx={{ fontSize: px(20) }} />}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          backgroundColor: isValid ? Colors.green : "initial",
        }}
      >
        {recompense.recompenses.map((el, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              flexGrow: 1,
            }}
          >
            {
              {
                GOLD: <img alt="money" src={moneyIcon} width={px(50)} />,
                XP: <img alt="xp" src={xpIcon} width={px(50)} />,
              }[el.type]
            }
            <Typography variant="h2" component="p">
              x{el.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
