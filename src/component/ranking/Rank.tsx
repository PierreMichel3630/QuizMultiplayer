import { Avatar, Typography, TypographyVariant } from "@mui/material";
import { Box } from "@mui/system";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { Colors } from "src/style/Colors";

interface Props {
  value: number;
  variant?: TypographyVariant;
  icon?: boolean;
  size?: number;
}

export const Rank = ({ value, variant = "h2", size = 35 }: Props) => {
  const { i18n, t } = useTranslation();

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
            width={size}
            height={size}
            loading="lazy"
          />
        );
        break;
      case 2:
        icon = (
          <img
            alt="rank icon"
            src={rank2}
            width={size}
            height={size}
            loading="lazy"
          />
        );
        break;
      case 3:
        icon = (
          <img
            alt="rank icon"
            src={rank3}
            width={size}
            height={size}
            loading="lazy"
          />
        );
        break;
    }
    return icon;
  }, [value, size]);

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
      {iconRank ?? (
        <Box sx={{ display: "flex", alignItems: "flex-start" }}>
          <Typography variant={variant}>{value}</Typography>
          <Typography>{t(`ordinal.ordinal_${rule}`)}</Typography>
        </Box>
      )}
    </Box>
  );
};

interface PropsRankBadge {
  value: number;
}

export const RankBadge = ({ value }: PropsRankBadge) => {
  const icon = useMemo(() => {
    let result = (
      <Avatar sx={{ bgcolor: Colors.grey4, width: 25, height: 25 }}>
        <Typography variant="h6" color="text.secondary">
          {value}
        </Typography>
      </Avatar>
    );
    switch (value) {
      case 1:
        result = <img alt="rank icon" src={rank1} width={30} loading="lazy" />;
        break;
      case 2:
        result = <img alt="rank icon" src={rank2} width={30} loading="lazy" />;
        break;
      case 3:
        result = <img alt="rank icon" src={rank3} width={30} loading="lazy" />;
        break;
    }
    return result;
  }, [value]);

  return icon;
};
