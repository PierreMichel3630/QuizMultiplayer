import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { t } from "i18next";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { Colors } from "src/style/Colors";

interface Props {
  value: number;
  max: number;
  color: string;
}

export const Bar = ({ value, max, color }: Props) => {
  const percentValue = useMemo(() => (value / max) * 100, [value, max]);

  return (
    <Box
      sx={{
        width: percent(100),
        backgroundColor: Colors.white,
        height: px(10),
        borderRadius: px(5),
      }}
    >
      <Box
        sx={{
          width: percent(percentValue),
          height: px(10),
          backgroundColor: color,
          borderRadius: px(5),
          zIndex: 5,
        }}
      ></Box>
    </Box>
  );
};

interface PropsBarAccomplishment {
  value: number;
}

export const BarAccomplishment = ({ value }: PropsBarAccomplishment) => {
  const { nbPlayers } = useApp();
  const percentText = useMemo(
    () => (nbPlayers ? ((value / nbPlayers) * 100).toFixed(1) : 0),
    [value, nbPlayers]
  );

  return (
    nbPlayers && (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>
            {t("commun.unlockaccomplishmentplayer", { percent: percentText })}
          </Typography>
          <Typography variant="h6">{`${value} / ${nbPlayers}`}</Typography>
        </Box>
        <Bar color={Colors.grey6} max={nbPlayers} value={value} />
      </Box>
    )
  );
};
