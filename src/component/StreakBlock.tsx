import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { TypeRecompense } from "src/models/enum/TypeRecompense";
import { Colors } from "src/style/Colors";

import xpIcon from "src/assets/xp.svg";
import moneyIcon from "src/assets/money.svg";

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
  day: number;
  type: TypeRecompense;
  value: number;
}
export const StreakRecompense = ({
  day,
  type,
  value,
}: PropsStreakRecompense) => {
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        border: `1px solid ${Colors.grey2}`,
        borderRadius: px(15),
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          backgroundColor: Colors.grey,
          borderTopLeftRadius: px(15),
          borderTopRightRadius: px(15),
          borderBottom: `1px solid ${Colors.grey2}`,
        }}
      >
        <Typography variant="h6" component="p">
          {t("commun.dayvalue", {
            value: day,
          })}
        </Typography>
      </Box>
      <Box
        sx={{
          p: px(3),
        }}
      >
        {
          {
            GOLD: <img src={moneyIcon} width={percent(50)} />,
            XP: <img src={xpIcon} width={percent(50)} />,
          }[type]
        }
        <Typography variant="h2" component="p">
          x{value}
        </Typography>
      </Box>
    </Box>
  );
};
