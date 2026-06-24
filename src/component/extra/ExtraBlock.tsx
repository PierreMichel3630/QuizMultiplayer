import { Box } from "@mui/material";
import { percent } from "csx";
import { ExtraChallenge } from "src/models/Challenge";
import { ExperienceBlock } from "../ExperienceBlock";
import { AddMoneyBlock } from "../MoneyBlock";
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
        {value.xp && <ExperienceBlock xp={value.xp.previousValue} xpgain={value.xp.value} />}
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
