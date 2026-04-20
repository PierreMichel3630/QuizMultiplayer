import HomeIcon from "@mui/icons-material/Home";
import { Typography } from "@mui/material";
import { Box, Container, Grid } from "@mui/system";
import { important, px } from "csx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ConnectAlert } from "src/component/alert/ConnectAlert";
import { BestScoreBlock } from "src/component/BestScoreBlock";
import { ButtonColor } from "src/component/Button";
import { MyExperienceSoloBlock } from "src/component/ExperienceBlock";
import { CircularLoading } from "src/component/Loading";
import { GameModeDialog } from "src/component/modal/gamemode/GameModeModal";
import { AddMoneyBlock } from "src/component/MoneyBlock";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeGameMode } from "src/models/enum/GameMode";
import { Order } from "src/models/enum/Order";
import { GameModeScore, ResultGameModeScore } from "src/models/GameMode";
import { Colors } from "src/style/Colors";
import { RankingGameMode } from "./RankingGameMode";

interface Props {
  type: TypeGameMode;
  order?: Order;
  fixed?: number;
  unit?: string;
  result: null | ResultGameModeScore;
  extra?: JSX.Element;
  onLeave: () => void;
  onNewGame: () => void;
}

export const ResultGameMode = ({
  type,
  order,
  unit,
  result,
  extra,
  onNewGame,
  onLeave,
  fixed = 0,
}: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<GameModeScore | undefined>(undefined);

  return (
    <>
      <Grid container spacing={2} justifyContent="center" sx={{ mb: px(120) }}>
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
              <>
                <Grid size={12}>
                  <Typography variant="h2">{t("gamemode.results")}</Typography>
                </Grid>
                <Grid size={12}>
                  <CircularLoading />
                </Grid>
              </>
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
        <Grid size={12}>
          <RankingGameMode
            type={type}
            unit={unit}
            fixed={fixed}
            order={order}
            rowsPerPage={5}
            onClick={setData}
          />
        </Grid>
        {extra && <Grid size={12}>{extra}</Grid>}
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "background.paper",
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              display: "flex",
              gap: 1,
              p: 1,
              flexDirection: "column",
            }}
          >
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
                value={Colors.green}
                label={t("commun.returnhome")}
                icon={HomeIcon}
                onClick={() => {
                  navigate("/");
                }}
                variant="contained"
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
          </Box>
        </Container>
      </Box>
      <GameModeDialog
        type={type}
        open={data !== undefined}
        close={() => setData(undefined)}
        data={data}
      />
    </>
  );
};
