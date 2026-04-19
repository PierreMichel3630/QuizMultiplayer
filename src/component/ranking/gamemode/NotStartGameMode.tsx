import { Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { useTranslation } from "react-i18next";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { ButtonColor } from "src/component/Button";
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
  getDetail: (data: GameModeScore) => void;
}

export const NotStartGameMode = ({
  type,
  order,
  unit,
  newGame,
  getDetail,
  fixed = 0,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid size={12}>
        <TitleBlock title={t(`gamemode.${type}.name`)} />
      </Grid>
      <Grid size={12}>
        <Typography fontSize={15}>{t(`gamemode.${type}.rules`)}</Typography>
      </Grid>
      {profile === null && (
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
          onClick={getDetail}
        />
      </Grid>
    </Grid>
  );
};
