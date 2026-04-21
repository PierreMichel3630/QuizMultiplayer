import { Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { BestScoreBlockGameMode } from "src/component/BestScoreBlock";
import { ButtonColor } from "src/component/Button";
import { GameModeDialog } from "src/component/modal/gamemode/GameModeModal";
import { TitleBlock } from "src/component/title/Title";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { GameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";
import { RankingGameMode } from "./RankingGameMode";

interface Props {
  type: TypeGameMode;
  order: Order;
  unit?: string;
  fixed?: number;
  newGame: () => void;
}

export const NotStartGameMode = ({
  type,
  order,
  unit,
  newGame,
  fixed = 0,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [data, setData] = useState<GameModeScore | undefined>(undefined);

  return (
    <>
      <Grid container spacing={2} justifyContent="center">
        <Grid size={12}>
          <TitleBlock title={t(`gamemode.${type}.name`)} />
        </Grid>
        <Grid size={12}>
          <Typography fontSize={15}>{t(`gamemode.${type}.rules`)}</Typography>
        </Grid>
        {profile ? (
          <Grid size={12}>
            <BestScoreBlockGameMode
              type={type}
              unit={unit}
              fixed={fixed}
              order={order}
            />
          </Grid>
        ) : (
          <Grid size={12} sx={{ display: "flex", justifyContent: "center" }}>
            <ConnectAlert />
          </Grid>
        )}
        <Grid size={12}>
          <ButtonColor
            value={Colors.colorApp}
            label={t("commun.launchgame")}
            variant="contained"
            onClick={newGame}
          />
        </Grid>
        <Grid size={12}>
          <RankingGameMode
            type={type}
            unit={unit}
            fixed={fixed}
            order={order}
            onClick={setData}
          />
        </Grid>
      </Grid>

      <GameModeDialog
        type={type}
        open={data !== undefined}
        close={() => setData(undefined)}
        data={data}
      />
    </>
  );
};
