import { Paper, Grid, Typography } from "@mui/material";
import {
  Accomplishment,
  StatAccomplishment,
  StatAccomplishmentEnum,
} from "src/models/Accomplishment";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { useApp } from "src/context/AppProvider";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { Link } from "react-router-dom";

interface Props {
  accomplishment: Accomplishment;
  stat?: StatAccomplishment;
  isFinish: boolean;
}

export const CardAccomplishment = ({
  accomplishment,
  stat,
  isFinish,
}: Props) => {
  const { t } = useTranslation();
  const { themes } = useApp();

  const champ = stat ? stat[accomplishment.champ as StatAccomplishmentEnum] : 0;
  const value = Array.isArray(champ) ? champ.length : champ;

  const themesAccomplishment = Array.isArray(champ)
    ? themes
        .filter((el) => champ.includes(el.id))
        .splice(0, accomplishment.value)
    : [];

  return (
    <Paper
      elevation={5}
      sx={{
        p: 1,
        backgroundColor: isFinish ? Colors.green : "initial",
        color: isFinish ? Colors.white : "initial",
      }}
    >
      <Grid container spacing={1} alignItems="center">
        {accomplishment.badge && (
          <Grid item>
            <Link to={`/personalized#badges`}>
              <img src={accomplishment.badge.icon} width={50} />
            </Link>
          </Grid>
        )}
        <Grid item xs container>
          <Grid item xs={12}>
            <JsonLanguageBlock variant="h4" value={accomplishment.label} />
          </Grid>
          {accomplishment.title && (
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
        </Grid>
        <Grid item>
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
      </Grid>
    </Paper>
  );
};
