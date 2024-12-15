import { Box, Divider, Grid, Paper, Switch, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

import { Theme, ThemeDifficulty } from "src/models/Theme";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { useEffect, useState } from "react";
import { SelectDifficulty } from "./Select";
import { Difficulty } from "src/models/enum/DifficultyEnum";

interface Props {
  themes: Array<Theme>;
  themesSelect: Array<ThemeDifficulty>;
  select: (theme: Array<ThemeDifficulty>) => void;
}

export const ParametersThemeBlock = ({
  select,
  themes,
  themesSelect,
}: Props) => {
  const { t } = useTranslation();
  const [all, setAll] = useState(false);

  const selectTheme = (value: ThemeDifficulty) => {
    const theme = themesSelect.find((el) => el.theme.id === value.theme.id);
    if (theme) {
      select([...themesSelect].filter((el) => el.theme.id !== value.theme.id));
    } else {
      select([...themesSelect, value]);
    }
  };

  const updateTheme = (value: ThemeDifficulty) => {
    const indexTheme = themesSelect.findIndex(
      (el) => el.theme.id === value.theme.id
    );
    if (indexTheme !== -1) {
      const newThemes = [...themesSelect];
      newThemes[indexTheme] = value;
      select(newThemes);
    }
  };

  useEffect(() => {
    select(
      all
        ? themes.map((el) => ({
            theme: el,
            difficultymin: Difficulty.FACILE,
            difficultymax: Difficulty.IMPOSSIBLE,
          }))
        : []
    );
  }, [all, select, themes]);

  return (
    <Paper
      sx={{
        p: 1,
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <Box>
        <Typography variant="h2">{t("commun.parameters")}</Typography>
        <Divider />
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          minHeight: 0,
          flexDirection: "column",
          flex: "1 1 0",
        }}
      >
        <Box
          sx={{
            overflowY: "auto",
            overflowX: "hidden",
            pr: 2,
            flexGrow: 1,
            minHeight: 0,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              minHeight: 0,
            }}
          >
            <Box>
              <Grid container spacing={1} alignItems="center">
                <Grid item>
                  <Switch
                    checked={all}
                    onChange={() => setAll((prev) => !prev)}
                  />
                </Grid>
                <Grid item>
                  <Typography variant="h2">{t("commun.all")}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Box>
              <Grid container spacing={1} alignItems="center">
                <Grid item xs={4}></Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">
                    {t("commun.levelquestionmin")}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h6">
                    {t("commun.levelquestionmax")}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
            {themes.map((theme, index) => {
              const themeSelect = themesSelect.find(
                (el) => el.theme.id === theme.id
              );
              return (
                <Box key={index}>
                  <Grid container spacing={1} alignItems="center">
                    <Grid
                      item
                      xs={4}
                      sx={{ display: "flex", gap: 1, alignItems: "center" }}
                    >
                      <Switch
                        checked={themeSelect !== undefined}
                        onChange={() =>
                          selectTheme({
                            theme,
                            difficultymin: Difficulty.FACILE,
                            difficultymax: Difficulty.IMPOSSIBLE,
                          })
                        }
                      />
                      <JsonLanguageBlock variant="h2" value={theme.name} />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectDifficulty
                        value={
                          themeSelect
                            ? themeSelect.difficultymin
                            : Difficulty.FACILE
                        }
                        onSelect={(value) =>
                          themeSelect &&
                          updateTheme({ ...themeSelect, difficultymin: value })
                        }
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <SelectDifficulty
                        value={
                          themeSelect
                            ? themeSelect.difficultymax
                            : Difficulty.IMPOSSIBLE
                        }
                        onSelect={(value) =>
                          themeSelect &&
                          updateTheme({ ...themeSelect, difficultymax: value })
                        }
                      />
                    </Grid>
                  </Grid>
                </Box>
              );
            })}
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};
