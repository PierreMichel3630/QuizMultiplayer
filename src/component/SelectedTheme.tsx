import { Box, Divider, Grid, Typography } from "@mui/material";
import { uniqBy } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useApp } from "src/context/AppProvider";
import { useUser } from "src/context/UserProvider";
import { Theme } from "src/models/Theme";
import { sortByName } from "src/utils/sort";
import { CardSelectAvatarTheme } from "./card/CardTheme";

interface Props {
  avatars: Array<{ id: number; avatars: Array<string> }>;
  select: (theme: Theme) => void;
}
export const SelectedTheme = ({ select, avatars }: Props) => {
  const { t } = useTranslation();

  const { language } = useUser();
  const { themes } = useApp();

  const themesDisplay = useMemo(() => {
    const themesPlayers = [...avatars].map((el) => el.id);
    const themesSelected = themes.filter((el) => themesPlayers.includes(el.id));
    const themeUniq = uniqBy(themesSelected, (el) => el.id);
    return themeUniq.sort((a, b) => sortByName(language, a, b));
  }, [themes, language, avatars]);

  return (
    themesDisplay.length > 0 && (
      <Grid container spacing={1}>
        <Grid
          item
          xs={12}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h2">{t("commun.themesselected")}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Box
            sx={{
              display: "flex",
              gap: 1,
              overflowX: "auto",
              scrollbarWidth: "none",
            }}
          >
            {themesDisplay.map((theme, index) => (
              <CardSelectAvatarTheme
                key={index}
                theme={theme}
                avatars={avatars}
                onSelect={() => select(theme)}
              />
            ))}
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Divider sx={{ borderBottomWidth: 5 }} />
        </Grid>
      </Grid>
    )
  );
};
