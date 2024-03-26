import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import CheckIcon from "@mui/icons-material/Check";
import { px } from "csx";

interface Props {
  ready: boolean;
}

export const StatusPlayerGame = ({ ready }: Props) => {
  const { t } = useTranslation();

  return (
    <Box sx={{ display: "flex", gap: 1 }}>
      {ready ? (
        <>
          <CheckIcon />
          <Typography variant="h6">{t("commun.ready")}</Typography>
        </>
      ) : (
        <>
          <Box
            sx={{
              width: px(60),
              aspectRation: 2,
              background:
                "no-repeat radial-gradient(circle closest-side,#fff 90%,#0000) 0% 50%, no-repeat radial-gradient(circle closest-side,#fff 90%,#0000) 50% 50%, no-repeat radial-gradient(circle closest-side,#fff 90%,#0000) 100% 50%",
              backgroundSize: "calc(100%/3) 50%",
              animation: "l3 1s infinite linear",
            }}
          />
          <Typography variant="h6">{t("commun.wait")}</Typography>
        </>
      )}
    </Box>
  );
};
