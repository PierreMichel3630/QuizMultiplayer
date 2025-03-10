import { Box, Dialog, DialogContent, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { px } from "csx";
import { Fragment, useEffect, useState } from "react";
import moneyIcon from "src/assets/money.svg";
import xpIcon from "src/assets/xp.svg";
import {
  MAX_DAY_RECOMPENSES_STREAK,
  RECOMPENSES_STREAK,
} from "src/configuration/configuration";
import { useAuth } from "src/context/AuthProviderSupabase";
import { StreakDayRecompense } from "src/models/Recompense";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { StreakBlock } from "../StreakBlock";

import CheckIcon from "@mui/icons-material/Check";

interface Props {
  open: boolean;
  close: () => void;
}

export const StreakLoginModal = ({ open, close }: Props) => {
  const { t } = useTranslation();
  const { profile } = useAuth();

  const [recompense, setRecompense] = useState<StreakDayRecompense | null>(
    null
  );

  useEffect(() => {
    if (profile) {
      const streakValue =
        profile.streak > MAX_DAY_RECOMPENSES_STREAK
          ? MAX_DAY_RECOMPENSES_STREAK
          : profile.streak;
      const recompense = RECOMPENSES_STREAK.find(
        (el) => el.day === streakValue
      );
      if (recompense) {
        setRecompense(recompense);
      }
    }
  }, [profile]);
  return (
    <Dialog onClose={close} open={open} maxWidth="sm">
      <DialogContent sx={{ p: 2, pt: 3 }}>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12}>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <StreakBlock
                value={profile?.streak ?? 0}
                logoSize={40}
                textSize={35}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h6">{t("commun.streakexplain")}</Typography>
          </Grid>
          <Grid item xs={12}>
            {recompense && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                {recompense.recompenses.map((el, index) => (
                  <Fragment key={index}>
                    {
                      {
                        GOLD: (
                          <img alt="money" src={moneyIcon} width={px(40)} />
                        ),
                        XP: <img alt="xp" src={xpIcon} width={px(50)} />,
                      }[el.type]
                    }
                    <Typography variant="h2" component="p">
                      x{el.value}
                    </Typography>
                  </Fragment>
                ))}
              </Box>
            )}
          </Grid>
          <Grid item xs={12}>
            <ButtonColor
              fullWidth
              value={Colors.blue}
              label={t("commun.ok")}
              icon={CheckIcon}
              variant="contained"
              onClick={() => close()}
            />
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
