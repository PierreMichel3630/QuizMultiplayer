import { Grid } from "@mui/material";
import { useTranslation } from "react-i18next";
import { CategoryBlock } from "./category/CategoryBlock";

import { useGameModes } from "src/hook/useGameModes";

export const GameModeBlock = () => {
  const { t } = useTranslation();
  const { allValues, count } = useGameModes();

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        {allValues.length > 0 && (
          <CategoryBlock
            title={t("commun.gamemode")}
            count={count}
            link={`/gamemode`}
            values={allValues}
          />
        )}
      </Grid>
    </Grid>
  );
};
