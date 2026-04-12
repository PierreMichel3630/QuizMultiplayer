import { Box, Typography } from "@mui/material";
import { padding, px, percent } from "csx";
import moment from "moment";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { MAX_DAY_NEW_THEME } from "src/utils/config";

interface Props {
  date: Date;
  fontSize?: number
}
export const BadgeNew = ({ date, fontSize = 10 }: Props) => {
  const { t } = useTranslation();

  const isNew = useMemo(
    () => moment().diff(moment(date), "days") < MAX_DAY_NEW_THEME,
    [date],
  );

  return (
    isNew && (
      <Box
        sx={{
          position: "absolute",
          p: padding(2, 5),
          borderRadius: px(5),
          backgroundColor: Colors.red,
          top: percent(50),
          left: percent(50),
          transform: "translate(-50%, -50%) rotate(-30deg)",
          transformOrigin: "center",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: px(fontSize) }}>
          {t("commun.new")}
        </Typography>
      </Box>
    )
  );
};
