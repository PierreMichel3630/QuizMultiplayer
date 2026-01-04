import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";

export interface Data {
  label: string | number;
  value: number;
  color: string;
}

interface Props {
  data: Array<Data>;
}
export const RatingChart = ({ data }: Props) => {
  const { t } = useTranslation();
  const max = useMemo(
    () => Math.max(...[...data].map((el) => el.value)),
    [data]
  );
  return (
    <Box sx={{ display: "flex", gap: 1, height: px(150) }}>
      {data.map((el, index) => (
        <Box
          key={index}
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            alignItems: "center",
            position: "relative",
          }}
        >
          <Box
            sx={{
              backgroundColor: el.color,
              width: percent(100),
              height: percent((el.value * 100) / max),
            }}
          />
          <Box
            sx={{
              position: "absolute",
              bottom: px(20),
              width: percent(100),
              textAlign: "center",
            }}
          >
            <Typography
              variant="caption"
              sx={{ writingMode: "sideways-lr", transform: "scale(1)" }}
            >
              <Trans
                i18nKey={t("commun.game")}
                values={{
                  count: el.value,
                }}
              />
            </Typography>
          </Box>
          <Typography variant="h6">{el.label}</Typography>
        </Box>
      ))}
    </Box>
  );
};
