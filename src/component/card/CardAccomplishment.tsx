import { Box, Grid, Paper, Typography } from "@mui/material";
import { uniqBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useApp } from "src/context/AppProvider";
import {
  Accomplishment,
  StatAccomplishment,
  StatAccomplishmentEnum,
} from "src/models/Accomplishment";
import { Colors } from "src/style/Colors";
import { ImageThemeBlock } from "../ImageThemeBlock";

import { percent, px } from "csx";
import { selectThemesByIdAndLanguage } from "src/api/theme";
import { Theme } from "src/models/Theme";
import { BarAccomplishment } from "../bar/Bar";
import { TextNameBlock } from "../language/TextLanguageBlock";
import { AddMoneyBlock } from "../MoneyBlock";
import { AddXpBlock } from "../XpBlock";

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
    [accomplishment.champ, stat],
  );

  const value = useMemo(
    () => (Array.isArray(champ) ? champ.length : champ),
    [champ],
  );

  useEffect(() => {
    if (Array.isArray(champ) && champ.length > 0) {
      selectThemesByIdAndLanguage(champ).then(({ data }) => {
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
            (el) => el.id,
          )
        : [],
    [accomplishment.value, champ, themes],
  );

  const myaccomplishment = useMemo(
    () =>
      myaccomplishments.find(
        (el) => el.accomplishment.id === accomplishment.id,
      ),
    [accomplishment, myaccomplishments],
  );

  const isFinish = useMemo(
    () => myaccomplishment?.validate,
    [myaccomplishment],
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
        <Grid size={12}>
          <TextNameBlock
            variant="h4"
            values={accomplishment.accomplishmenttranslation}
          />
        </Grid>
        {badge && accomplishment.badge && (
          <Grid>
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
        <Grid size={accomplishment.value ? 7 : 12}>
          <Grid container spacing={1} alignItems="center">
            {title && accomplishment.title && (
              <Grid size={12}>
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
            <Grid size={12}>
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
          <Grid sx={{ textAlign: "end" }} size="grow">
            <Typography variant="h2" component="span">
              {Math.min(value, accomplishment.value)}
            </Typography>
            <Typography variant="body1" component="span">
              {`/ ${accomplishment.value}`}
            </Typography>
          </Grid>
        )}
        {themesAccomplishment.length > 0 && (
          <Grid size={12}>
            <Grid container spacing={1}>
              {themesAccomplishment.map((theme) => (
                <Grid key={theme.id}>
                  <Link to={`/theme/${theme.id}`}>
                    <ImageThemeBlock theme={theme} size={35} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Grid>
        )}
        <Grid size={12}>
          <BarAccomplishment value={accomplishment.nbplayers} />
        </Grid>
      </Grid>
    </Paper>
  );
};
