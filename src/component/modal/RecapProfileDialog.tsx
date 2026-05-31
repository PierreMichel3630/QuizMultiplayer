import {
  Grid,
  Typography
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useUser } from "src/context/UserProvider";
import { ProfileWithRanking } from "src/models/Profile";
import { MoneyArrondieBlock } from "../MoneyBlock";
import { StreakBlock } from "../StreakBlock";
import { BaseRecapDialog } from "./commun/BaseRecapDialog";

interface Props {
  data?: ProfileWithRanking;
  open: boolean;
  close: () => void;
}
export const RecapProfileDialog = ({ data, open, close }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  return (
    <BaseRecapDialog open={open} close={close} profile={data?.profile}>
      {data && (
        <>
          <Grid
            size={12}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">{t("commun.money")} :</Typography>
            <MoneyArrondieBlock money={data.money} language={language} />
          </Grid>
          <Grid
            size={12}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              justifyContent: "center",
            }}
          >
            <Typography variant="h6">{t("commun.currentstreak")} :</Typography>
            <StreakBlock value={data.streak} />
          </Grid>
        </>
      )}
    </BaseRecapDialog>
  );
};
