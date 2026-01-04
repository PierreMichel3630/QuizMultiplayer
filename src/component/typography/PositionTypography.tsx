import { Typography, TypographyVariant } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";

interface Props {
  position: number;
  variant?: TypographyVariant;
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
