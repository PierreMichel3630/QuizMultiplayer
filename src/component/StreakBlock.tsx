import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";

import CheckIcon from "@mui/icons-material/Check";
import { useMemo } from "react";
import moneyIcon from "src/assets/money.svg";
import xpIcon from "src/assets/xp.svg";
import { LoginStreakDayRecompense } from "src/models/Recompense";

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
  recompense: LoginStreakDayRecompense;
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
        }}
      >
        <Typography variant="h6" component="p">
          {t(isLast ? "commun.daysupvalue" : "commun.dayvalue", {
            value: recompense.day,
          })}
        </Typography>
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
            {isValid ? (
              <CheckIcon sx={{ fontSize: px(60) }} />
            ) : (
              <>
                {
                  {
                    GOLD: <img alt="money" src={moneyIcon} width={px(50)} />,
                    XP: <img alt="xp" src={xpIcon} width={px(50)} />,
                  }[el.type]
                }
                <Typography variant="h2" component="p">
                  x{el.value}
                </Typography>
              </>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
};

interface PropsStreakRecompenseFinal {
  day: number;
  valueGold: number;
  valueXp: number;
}
export const StreakRecompenseFinal = ({
  day,
  valueGold,
  valueXp,
}: PropsStreakRecompenseFinal) => {
  const { t } = useTranslation();
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
        }}
      >
        <Typography variant="h6" component="p">
          {t("commun.daysupvalue", {
            value: day,
          })}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexGrow: 1,
          gap: 2,
        }}
      >
        <Box>
          <img alt="money" src={moneyIcon} width={px(50)} />
          <Typography variant="h2" component="p">
            x{valueGold}
          </Typography>
        </Box>
        <Box>
          <img alt="xp" src={xpIcon} width={px(50)} />
          <Typography variant="h2" component="p">
            x{valueXp}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
