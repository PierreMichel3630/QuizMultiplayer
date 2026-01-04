import { Typography } from "@mui/material";
import { Variant } from "@mui/material/styles/createTypography";
import { Trans, useTranslation } from "react-i18next";

interface Props {
  position: number;
  variant?: Variant;
}

export const PositionTypography = ({ position, variant = "h2" }: Props) => {
  const { t } = useTranslation();
  return (
    <Typography variant={variant} noWrap>
      <Trans
        i18nKey={t("commun.position")}
        values={{
          count: position,
        }}
        components={{ sup: <sup /> }}
      />
    </Typography>
  );
};
