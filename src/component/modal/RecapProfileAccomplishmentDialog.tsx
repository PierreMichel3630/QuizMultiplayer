import { Divider, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { StatAccomplishmentWithRanking } from "src/models/Accomplishment";
import { BarVictory } from "../chart/BarVictory";
import { BaseRecapDialog, useBaseRecapDialog } from "./commun/BaseRecapDialog";
import { StreakBlock } from "../StreakBlock";
import { Theme } from "src/models/Theme";

interface Props {
  data?: StatAccomplishmentWithRanking;
  theme?: Theme;
  open: boolean;
  close: () => void;
}
export const RecapProfileAccomplishmentDialog = ({
  data,
  open,
  close,
}: Props) => {
  return (
    <BaseRecapDialog open={open} close={close} profileId={data?.profile.id}>
      <RecapProfileAccomplishmentDialogBody />
    </BaseRecapDialog>
  );
};

const RecapProfileAccomplishmentDialogBody = () => {
  const { t } = useTranslation();
  const { stat, profile } = useBaseRecapDialog();

  return (
    stat &&
    profile && (
      <Grid container spacing={1}>
        <Grid size={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.daychallenge")}</Typography>
        </Grid>
        <Grid
          size={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" component="span">
            {t("commun.beststreak")}
          </Typography>
          <StreakBlock value={stat.streak} />
        </Grid>
        <Grid
          size={6}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" component="span">
            {t("commun.currentstreak")}
          </Typography>
          <StreakBlock value={profile.streak ?? 0} />
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.solo")}</Typography>
        </Grid>
        <Grid size={12} sx={{ textAlign: "center" }}>
          <Typography variant="body1" component="span">
            {t("commun.games")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.games}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {t("commun.pointssolo")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.pointssolo}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {t("commun.gameshundredpts")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.gameshundredpts}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {t("commun.gamesfiftypts")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.gamesfiftypts}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {t("commun.gamestwentypts")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.gamestwentypts}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {t("commun.gamestenpts")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.gamestenpts}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {t("commun.themetenpts")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.themetenpts.length}
          </Typography>
        </Grid>
        <Grid>
          <Typography variant="body1" component="span">
            {t("commun.themetwentypts")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.themetwentypts.length}
          </Typography>
        </Grid>
        <Grid size={12}>
          <Divider />
        </Grid>
        <Grid size={12} sx={{ textAlign: "center" }}>
          <Typography variant="h2">{t("commun.duel")}</Typography>
        </Grid>
        <Grid size={12} sx={{ textAlign: "center" }}>
          <Typography variant="body1" component="span">
            {t("commun.games")} {" : "}
          </Typography>
          <Typography variant="h4" component="span">
            {stat.duelgames}
          </Typography>
        </Grid>
        <Grid size={12}>
          <BarVictory
            victory={stat.victoryduel}
            draw={stat.drawduel}
            defeat={stat.defeatduel}
          />
        </Grid>
      </Grid>
    )
  );
};
