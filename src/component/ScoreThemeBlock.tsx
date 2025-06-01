import { Box, Grid, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Theme } from "src/models/Theme";
import { ImageThemeBlock } from "./ImageThemeBlock";

interface Props {
  theme: Theme;
  score?: number;
  extra?: JSX.Element;
  color?: string;
}

export const ScoreThemeBlock = ({
  theme,
  score,
  extra,
  color = "text.primary",
}: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={3} sm={3} md={2}>
        <ImageThemeBlock theme={theme} />
      </Grid>
      <Grid item xs={9} sm={9} md={10}>
        <Typography
          variant="h1"
          color={color}
          sx={{
            fontSize: 30,
            overflow: "hidden",
            display: "block",
            lineClamp: 1,
            boxOrient: "vertical",
          }}
          noWrap
        >
          {theme.title}
        </Typography>
        {score !== undefined && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h6" color={color}>
              {t("commun.score")} :{" "}
            </Typography>
            <Typography variant="h2" color={color}>
              {score}
            </Typography>
          </Box>
        )}
        {extra && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {extra}
          </Box>
        )}
      </Grid>
    </Grid>
  );
};
