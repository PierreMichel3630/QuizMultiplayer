import { Container, Grid } from "@mui/system";
import { useState } from "react";
import { AllGameModeEnum } from "src/models/enum/GameEnum";
import { GroupButtonAllGameMode } from "../button/ButtonGroup";
import { RankingChallengePerDate } from "./RankingChallenge";
import { RankingDuel } from "./RankingDuel";
import { RankingSolo } from "./RankingSolo";



export const RankingHomeBlock = () => {
  const [tab, setTab] = useState(AllGameModeEnum.challenge);

  const ITEM_PER_PAGE = 5;

  return (
    <Container maxWidth="sm">
      <Grid container spacing={1} alignItems="center">
        <Grid sx={{ display: "flex", justifyContent: "center" }} size={12}>
          <GroupButtonAllGameMode
            selected={tab}
            onChange={(value) => {
              setTab(value);
            }}
          />
        </Grid>
        <Grid size={12}>
          {
            {
              duel: <RankingDuel itemPerPage={ITEM_PER_PAGE} />,
              solo: <RankingSolo itemPerPage={ITEM_PER_PAGE} />,
              challenge: (
                <RankingChallengePerDate
                  itemPerPage={ITEM_PER_PAGE}
                  canChangeDate={false}
                />
              ),
            }[tab]
          }
        </Grid>
      </Grid>
    </Container>
  );
};