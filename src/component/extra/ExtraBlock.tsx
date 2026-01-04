import { ExtraChallenge } from "src/models/Challenge";
import { XpBar } from "../ExperienceBlock";
import { Box } from "@mui/material";
import { AddMoneyBlock } from "../MoneyBlock";
import { percent } from "csx";
import { AddXpImageBlock } from "../XpBlock";

interface PropsExtraBlock {
  value: ExtraChallenge;
}

export const ExtraBlock = ({ value }: PropsExtraBlock) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 1,
      }}
    >
      <Box sx={{ width: percent(100) }}>
        {value.xp && (
          <XpBar previousxp={value.xp.previousValue} value={value.xp.value} />
        )}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        {value.xp && (
          <AddXpImageBlock xp={value.xp.value} variant="h2" width={30} />
        )}
        {value.gold && (
          <AddMoneyBlock money={value.gold.value} variant="h2" width={25} />
        )}
      </Box>
    </Box>
  );
};
