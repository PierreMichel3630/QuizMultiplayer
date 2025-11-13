import { Box, Grid, Paper, Typography } from "@mui/material";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import {
  Accomplishment,
  ProfileAccomplishment,
  StatAccomplishment,
  StatAccomplishmentEnum,
} from "src/models/Accomplishment";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import LockOpenIcon from "@mui/icons-material/LockOpen";
import { percent, px } from "csx";
import { unlockAccomplishment } from "src/api/accomplishment";
import { selectThemesById } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { BarAccomplishment } from "../bar/Bar";
import { AddMoneyBlock } from "../MoneyBlock";
import { AddXpBlock } from "../XpBlock";
import { TextNameBlock } from "../language/TextLanguageBlock";

interface Props {
  accomplishment: Accomplishment;
  stat?: StatAccomplishment;
  badge?: boolean;
  title?: boolean;
}

export const CardAccomplishment = ({
  accomplishment,
  stat,
  badge = false,
  title = false,
}: Props) => {
  const { t } = useTranslation();
  const { myaccomplishments } = useApp();

  const [themes, setThemes] = useState<Array<Theme>>([]);

  const champ = useMemo(
    () => (stat ? stat[accomplishment.champ as StatAccomplishmentEnum] : 0),
    [accomplishment.champ, stat]
  );

  const value = useMemo(
    () => (Array.isArray(champ) ? champ.length : champ),
    [champ]
  );

  useEffect(() => {
    if (Array.isArray(champ) && champ.length > 0) {
      selectThemesById(champ).then(({ data }) => {
        setThemes(data ?? []);
      });
    }
  }, [champ]);

  const themesAccomplishment = useMemo(
    () =>
      Array.isArray(champ) && accomplishment.value
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

  return (
    <Paper
      elevation={12}
      sx={{
        p: 1,
        backgroundColor: isFinish ? Colors.correctanswer : "initial",
        color: isFinish ? Colors.white : "text.primary",
        border: "2px solid white",
        height: percent(100),
      }}
    >
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ height: percent(100) }}
      >
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
        <Grid item xs={accomplishment.value ? 7 : 12}>
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
                  <TextNameBlock
                    variant="h6"
                    component="span"
                    values={accomplishment.title.titletranslation}
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
        {accomplishment.value && (
          <Grid item xs sx={{ textAlign: "end" }}>
            <Typography variant="h2" component="span">
              {value > accomplishment.value ? accomplishment.value : value}
            </Typography>
            <Typography variant="body1" component="span">
              {`/ ${accomplishment.value}`}
            </Typography>
          </Grid>
        )}
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
      </Grid>
    </Paper>
  );
};

interface PropsCardUnlockAccomplishment {
  profileaccomplishment: ProfileAccomplishment;
  stat?: StatAccomplishment;
  badge?: boolean;
  title?: boolean;
}

export const CardUnlockAccomplishment = ({
  profileaccomplishment,
  stat,
  badge = false,
  title = false,
}: PropsCardUnlockAccomplishment) => {
  const { t } = useTranslation();
  const { refreshProfil } = useAuth();
  const { getMyAccomplishments } = useApp();

  const [themes, setThemes] = useState<Array<Theme>>([]);

  const champ = useMemo(
    () =>
      stat
        ? stat[
            profileaccomplishment.accomplishment.champ as StatAccomplishmentEnum
          ]
        : 0,
    [profileaccomplishment.accomplishment.champ, stat]
  );

  const value = useMemo(
    () => (Array.isArray(champ) ? champ.length : champ),
    [champ]
  );

  useEffect(() => {
    if (Array.isArray(champ) && champ.length > 0) {
      selectThemesById(champ).then(({ data }) => {
        setThemes(data ?? []);
      });
    }
  }, [champ]);

  const themesAccomplishment = useMemo(
    () =>
      Array.isArray(champ) && profileaccomplishment.accomplishment.value
        ? uniqBy(
            themes
              .filter((el) => champ.includes(el.id))
              .splice(0, profileaccomplishment.accomplishment.value),
            (el) => el.id
          )
        : [],
    [profileaccomplishment.accomplishment.value, champ, themes]
  );

  const unlock = async () => {
    unlockAccomplishment(profileaccomplishment.id).then((res) => {
      if (res.data === true) {
        getMyAccomplishments();
        refreshProfil();
      }
    });
  };

  return (
    <Paper
      elevation={12}
      sx={{
        p: 1,
        backgroundColor: "initial",
        color: "text.primary",
        border: `3px solid ${Colors.purple}`,
        height: percent(100),
      }}
    >
      <Grid
        container
        spacing={1}
        alignItems="center"
        sx={{ height: percent(100) }}
      >
        <Grid item xs={12}>
          <JsonLanguageBlock
            variant="h4"
            value={profileaccomplishment.accomplishment.label}
          />
        </Grid>
        {profileaccomplishment.extra && (
          <Grid item xs={12}>
            <Typography variant="caption">
              {profileaccomplishment.extra}
            </Typography>
          </Grid>
        )}
        {badge && profileaccomplishment.accomplishment.badge && (
          <Grid item>
            <Link to={`/personalized#badges`}>
              <img
                alt="badge"
                src={profileaccomplishment.accomplishment.badge.icon}
                width={40}
                loading="lazy"
              />
            </Link>
          </Grid>
        )}
        <Grid item xs={profileaccomplishment.accomplishment.value ? 7 : 12}>
          <Grid container spacing={1} alignItems="center">
            {title && profileaccomplishment.accomplishment.title && (
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
                  <TextNameBlock
                    component="span"
                    variant="caption"
                    values={
                      profileaccomplishment.accomplishment.title
                        .titletranslation
                    }
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
                {profileaccomplishment.accomplishment.xp > 0 && (
                  <AddXpBlock
                    xp={profileaccomplishment.accomplishment.xp}
                    variant="h4"
                    color={"text.primary"}
                  />
                )}
                {profileaccomplishment.accomplishment.gold > 0 && (
                  <AddMoneyBlock
                    money={profileaccomplishment.accomplishment.gold}
                    variant="h4"
                    color={"text.primary"}
                    width={18}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Grid>
        {profileaccomplishment.accomplishment.value && (
          <Grid item xs sx={{ textAlign: "end" }}>
            <Typography variant="h2" component="span">
              {value > profileaccomplishment.accomplishment.value
                ? profileaccomplishment.accomplishment.value
                : value}
            </Typography>
            <Typography variant="body1" component="span">
              {`/ ${profileaccomplishment.accomplishment.value}`}
            </Typography>
          </Grid>
        )}
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
      </Grid>
    </Paper>
  );
};
