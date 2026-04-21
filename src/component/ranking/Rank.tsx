import { Typography, TypographyVariant } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";

interface Props {
  value: number;
  variant?: TypographyVariant;
  icon?: boolean;
}

export const Rank = ({ value, variant = "h2" }: Props) => {
  const { i18n, t } = useTranslation();

  const iconSize = 20;
  const pr = new Intl.PluralRules(i18n.language, { type: "ordinal" });
  const rule = pr.select(value);

  const iconRank = useMemo(() => {
    let icon = undefined;
    switch (value) {
      case 1:
        icon = (
          <img
            alt="rank icon"
            src={rank1}
            width={iconSize}
            height={iconSize}
            loading="lazy"
          />
        );
        break;
      case 2:
        icon = (
          <img
            alt="rank icon"
            src={rank2}
            width={iconSize}
            height={iconSize}
            loading="lazy"
          />
        );
        break;
      case 3:
        icon = (
          <img
            alt="rank icon"
            src={rank3}
            width={iconSize}
            height={iconSize}
            loading="lazy"
          />
        );
        break;
    }
    return icon;
  }, [value]);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {iconRank}
      <Box sx={{ display: "flex", alignItems: "flex-start" }}>
        <Typography variant={variant}>{value}</Typography>
        <Typography>{t(`ordinal.ordinal_${rule}`)}</Typography>
      </Box>
    </Box>
  );
};
