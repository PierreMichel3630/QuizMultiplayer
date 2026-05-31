import {
  Divider,
  Grid,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { StatAccomplishmentWithRanking } from "src/models/Accomplishment";
import { BarVictory } from "../chart/BarVictory";
import { BaseRecapDialog } from "./commun/BaseRecapDialog";

interface Props {
  data?: StatAccomplishmentWithRanking;
  open: boolean;
  close: () => void;
}
export const RecapProfileAccomplishmentDialog = ({
  data,
  open,
  close,
}: Props) => {
  const { t } = useTranslation();

  return (
    <BaseRecapDialog open={open} close={close} profile={data?.profile}>
      {data && (
        <>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{t("commun.solo")}</Typography>
          </Grid>
          <Grid size={12} sx={{ textAlign: "center" }}>
            <Typography variant="body1" component="span">
              {t("commun.games")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.games}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" component="span">
              {t("commun.pointssolo")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.pointssolo}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" component="span">
              {t("commun.gameshundredpts")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.gameshundredpts}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" component="span">
              {t("commun.gamesfiftypts")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.gamesfiftypts}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" component="span">
              {t("commun.gamestwentypts")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.gamestwentypts}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" component="span">
              {t("commun.gamestenpts")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.gamestenpts}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" component="span">
              {t("commun.themetenpts")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.themetenpts.length}
            </Typography>
          </Grid>
          <Grid>
            <Typography variant="body1" component="span">
              {t("commun.themetwentypts")} {" : "}
            </Typography>
            <Typography variant="h4" component="span">
              {data.themetwentypts.length}
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
              {data.duelgames}
            </Typography>
          </Grid>
          <Grid size={12}>
            <BarVictory
              victory={data.victoryduel}
              draw={data.drawduel}
              defeat={data.defeatduel}
            />
          </Grid>
        </>
      )}
    </BaseRecapDialog>
  );
};
