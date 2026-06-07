import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { t } from "i18next";
import { Trans } from "react-i18next";

interface PropsRecapAvgGame {
  label?: string;
  count: number;
  value: number;
  extra?: JSX.Element;
}

export const RankingAverage = ({
  label = "commun.player",
  count,
  value,
  extra,
}: PropsRecapAvgGame) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        justifyContent: "center",
      }}
    >
      <Typography variant="body1">
        <Trans
          i18nKey={label}
          values={{
            count: count,
            formattedCount: count,
          }}
          components={{ bold: <strong /> }}
        />
      </Typography>
      <Box>
        <Typography variant="body1" component="span">
          {`( ${t("abrevation.average")} `}
        </Typography>
        <Typography variant="h6" component="span">
          {`${value.toFixed(2)}`}
        </Typography>
        {extra}
        <Typography variant="body1" component="span">
          {` )`}
        </Typography>
      </Box>
    </Box>
  );
};
