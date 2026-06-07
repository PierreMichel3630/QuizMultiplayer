import { Divider, Grid } from "@mui/material";
import { useState } from "react";
import { GameModeEnum } from "src/models/enum/GameEnum";
import { GroupButtonAllTypeGame } from "../button/ButtonGroup";
import { RankingDuel } from "./RankingDuel";
import { RankingGlobalSolo } from "./RankingSolo";

interface Props {
  themes?: Array<number>;
}

export const RankingCategoryBlock = ({ themes }: Props) => {
  const [tab, setTab] = useState(GameModeEnum.solo);

  const ITEM_PER_PAGE = 3;
  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <GroupButtonAllTypeGame
          selected={tab}
          onChange={setTab}
        />
      </Grid>
      <Grid size={12}>
        {
          {
            solo: <RankingGlobalSolo themes={themes} itemPerPage={ITEM_PER_PAGE} />,
            duel: <RankingDuel themes={themes} itemPerPage={ITEM_PER_PAGE}/>,
          }[tab]
        }
      </Grid>
      <Grid size={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
