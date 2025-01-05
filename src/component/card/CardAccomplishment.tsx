import { Box, Grid, Paper, Typography } from "@mui/material";
import { uniqBy } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import {
  Accomplishment,
  StatAccomplishment,
  StatAccomplishmentEnum,
} from "src/models/Accomplishment";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { px } from "csx";
import { unlockAccomplishment } from "src/api/accomplishment";
import { BarAccomplishment } from "../bar/Bar";
import { AddMoneyBlock } from "../MoneyBlock";
import { AddXpBlock } from "../XpBlock";

interface Props {
  accomplishment: Accomplishment;
  stat?: StatAccomplishment;
  badge?: boolean;
  title?: boolean;
  notification?: boolean;
}

export const CardAccomplishment = ({
  accomplishment,
  stat,
  badge = false,
  title = false,
  notification = false,
}: Props) => {
  const { t } = useTranslation();
  const { refreshProfil } = useAuth();
  const { themes, myaccomplishments, getMyAccomplishments } = useApp();

  const champ = stat ? stat[accomplishment.champ as StatAccomplishmentEnum] : 0;
  const value = Array.isArray(champ) ? champ.length : champ;

  const themesAccomplishment = useMemo(
    () =>
      Array.isArray(champ)
        ? uniqBy(
            themes
              .filter((el) => champ.includes(el.id))
              .splice(0, accomplishment.value),
            (el) => el.id
          )
        : [],
    [accomplishment.value, champ, themes]
  );

  const myaccomplishment = useMemo(
    () =>
      myaccomplishments.find(
        (el) => el.accomplishment.id === accomplishment.id
      ),
    [accomplishment, myaccomplishments]
  );

  const isFinish = useMemo(
    () => myaccomplishment?.validate,
    [myaccomplishment]
  );

  const isUnlock = useMemo(
    () => myaccomplishment !== undefined && !myaccomplishment.validate,
    [myaccomplishment]
  );

  const unlock = async () => {
    if (accomplishment) {
      unlockAccomplishment(accomplishment.id).then((res) => {
        if (res.data === true) {
          getMyAccomplishments();
          refreshProfil();
        }
      });
    }
  };

  return (
    <Paper
      elevation={12}
      sx={{
        p: 1,
        backgroundColor: isFinish ? Colors.green : "initial",
        color: isFinish ? Colors.white : "text.primary",
        border: isUnlock ? `3px solid ${Colors.purple}` : "2px solid white",
      }}
    >
      <Grid container spacing={1} alignItems="center">
        <Grid item xs={12}>
          <JsonLanguageBlock variant="h4" value={accomplishment.label} />
        </Grid>
        {badge && accomplishment.badge && (
          <Grid item>
            <Link to={`/personalized#badges`}>
              <img
                alt="badge"
                src={accomplishment.badge.icon}
                width={40}
                loading="lazy"
              />
            </Link>
          </Grid>
        )}
        <Grid item xs={7}>
          <Grid container spacing={1} alignItems="center">
            {title && accomplishment.title && (
              <Grid item xs={12}>
                <Typography variant="body1" component="span">
                  {`${t("commun.title")} "`}
                </Typography>
                <Link
                  to={`/personalized#titles`}
                  style={{
                    textDecoration: "none",
                  }}
                >
                  <JsonLanguageBlock
                    variant="h6"
                    component="span"
                    value={accomplishment.title.name}
                  />
                </Link>
                <Typography variant="body1" component="span">
                  {`"`}
                </Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: px(10),
                }}
              >
                {accomplishment.xp > 0 && (
                  <AddXpBlock
                    xp={accomplishment.xp}
                    variant="h4"
                    color={isFinish ? "text.secondary" : "text.primary"}
                  />
                )}
                {accomplishment.gold > 0 && (
                  <AddMoneyBlock
                    money={accomplishment.gold}
                    variant="h4"
                    color={isFinish ? "text.secondary" : "text.primary"}
                    width={18}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs sx={{ textAlign: "end" }}>
          <Typography variant="h2" component="span">
            {value > accomplishment.value ? accomplishment.value : value}
          </Typography>
          <Typography variant="body1" component="span">
            {`/ ${accomplishment.value}`}
          </Typography>
        </Grid>
        {themesAccomplishment.length > 0 && (
          <Grid item xs={12}>
            <Grid container spacing={1}>
              {themesAccomplishment.map((theme) => (
                <Grid item key={theme.id}>
                  <Link to={`/theme/${theme.id}`}>
                    <ImageThemeBlock theme={theme} size={35} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
        <Grid item xs={12}>
          <BarAccomplishment value={accomplishment.nbplayers} />
        </Grid>
        {isUnlock && (
          <Grid item xs={12}>
            <ButtonColor
              typography="h6"
              iconSize={20}
              value={Colors.purple}
              label={t("commun.unlock")}
              icon={LockOpenIcon}
              variant="contained"
              onClick={unlock}
            />
          </Grid>
        )}
        {notification && (
          <Grid item xs={12}>
            <Link to={`/accomplishments`}>
              <ButtonColor
                typography="h6"
                iconSize={20}
                value={Colors.yellow}
                label={t("commun.seeallaccomplishment")}
                icon={VisibilityIcon}
                variant="contained"
              />
            </Link>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

interface PropsUnlock {
  accomplishment: Accomplishment;
}

export const CardAccomplishmentUnlock = ({ accomplishment }: PropsUnlock) => {
  const { t } = useTranslation();
  return (
    <Paper
      elevation={5}
      sx={{
        p: 1,
        backgroundColor: "initial",
        color: "initial",
      }}
    >
      <Grid container spacing={1} alignItems="center">
        <Grid item xs container>
          <Grid item xs={12}>
            <Typography variant="body1" component="span">
              {t("notification.accomplishment.message")}
            </Typography>
            <JsonLanguageBlock
              variant="h4"
              component="span"
              value={accomplishment.label}
            />
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  );
};
