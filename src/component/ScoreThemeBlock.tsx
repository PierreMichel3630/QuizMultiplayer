import { Grid, Box, Typography } from "@mui/material";
import { ImageThemeBlock } from "./ImageThemeBlock";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { Theme } from "src/models/Theme";
import { useTranslation } from "react-i18next";

interface Props {
  theme: Theme;
  score: number;
}

export const ScoreThemeBlock = ({ theme, score }: Props) => {
  const { t } = useTranslation();

  return (
    <Grid container spacing={3} alignItems="center">
      <Grid item xs={3} sm={3} md={2}>
        <ImageThemeBlock theme={theme} />
      </Grid>
      <Grid item xs={9} sm={9} md={10}>
        <JsonLanguageBlock
          variant="h1"
          color="text.secondary"
          sx={{ wordBreak: "break-all", fontSize: 30 }}
          value={theme.name}
        />
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            {t("commun.score")} :{" "}
          </Typography>
          <Typography variant="h2" color="text.secondary">
            {score}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );
};
