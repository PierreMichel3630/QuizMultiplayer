import { Typography } from "@mui/material";
import { Grid } from "@mui/system";
import { important, px } from "csx";
import { useTranslation } from "react-i18next";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { BestScoreBlock } from "src/component/BestScoreBlock";
import { ButtonColor } from "src/component/Button";
import { MyExperienceSoloBlock } from "src/component/ExperienceBlock";
import { CircularLoading } from "src/component/Loading";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Order } from "src/models/enum/Order";
import { ResultGameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";

interface Props {
  order?: Order;
  unit?: string;
  result: null | ResultGameModeScore;
  extra?: JSX.Element;
  onLeave: () => void;
  onNewGame: () => void;
}

export const ResultGameMode = ({
  order,
  unit,
  result,
  extra,
  onNewGame,
  onLeave,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  return (
    <Grid container spacing={2} justifyContent="center">
      <Grid size={12}>
        <Typography variant="h2">{t("gamemode.results")}</Typography>
      </Grid>
      {profile ? (
        <>
          {result ? (
            <>
              {result.hasrecord ? (
                <Grid
                  size={12}
                  sx={{
                    color: Colors.correctanswer,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h2"
                    textAlign="center"
                    sx={{ fontSize: important(px(45)) }}
                  >
                    {t("commun.win")}
                  </Typography>
                  <Typography>{t("commun.newrecord")}</Typography>
                </Grid>
              ) : (
                <Grid
                  size={12}
                  sx={{
                    color: Colors.wronganswer,
                    textAlign: "center",
                  }}
                >
                  <Typography
                    variant="h2"
                    textAlign="center"
                    sx={{ fontSize: important(px(45)) }}
                  >
                    {t("commun.loose")}
                  </Typography>
                  <Typography>{t("commun.norecordbroken")}</Typography>
                </Grid>
              )}
              <Grid size={12}>
                <MyExperienceSoloBlock
                  xp={{
                    match: 50,
                    record: result.hasrecord ? 100 : undefined,
                  }}
                />
              </Grid>
              {result.hasrecord && (
                <Grid
                  sx={{ display: "flex", justifyContent: "center" }}
                  size={12}
                >
                  <AddMoneyBlock money={100} variant="h4" width={25} />
                </Grid>
              )}
            </>
          ) : (
            <Grid size={12}>
              <CircularLoading />
            </Grid>
          )}
        </>
      ) : (
        <Grid size={12}>
          <ConnectAlert />
        </Grid>
      )}
      <Grid size={12}>
        <BestScoreBlock
          score={result?.result.score}
          previousscore={result?.previousScore?.score}
          unit={unit}
          order={order}
        />
      </Grid>
      {extra && <Grid size={12}>{extra}</Grid>}
      <Grid size={12}>
        <ButtonColor
          value={Colors.colorApp}
          label={t("commun.replay")}
          variant="contained"
          onClick={onNewGame}
        />
      </Grid>
      <Grid size={12}>
        <ButtonColor
          value={Colors.red}
          label={t("commun.leave")}
          variant="contained"
          onClick={onLeave}
        />
      </Grid>
    </Grid>
  );
};
