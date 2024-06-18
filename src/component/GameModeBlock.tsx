import { Box, Divider, Grid, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useTranslation } from "react-i18next";
import { JsonLanguage } from "src/models/Language";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { useMemo } from "react";
import { useApp } from "src/context/AppProvider";
import { CardTheme } from "./card/CardTheme";
import { useAuth } from "src/context/AuthProviderSupabase";
import { insertBattleGame } from "src/api/game";
import { useNavigate } from "react-router-dom";

interface Mode {
  image: string;
  color: string;
  name: JsonLanguage;
  onClick: () => void;
}

export const GameModeBlock = () => {
  const { t } = useTranslation();
  const { themes } = useApp();
  const { user } = useAuth();
  const navigate = useNavigate();

  const modes: Array<Mode> = [
    {
      image:
        "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/theme/mode/swords.png",
      color: "#a569bd",
      name: {
        "fr-FR": "Combat contre un ami",
        "en-US": "Fight against a friend",
      },
      onClick: () => launchBattleGame(),
    },
  ];

  const launchBattleGame = async () => {
    if (user) {
      const insertValue = {
        player1: user.id,
      };
      const { data } = await insertBattleGame(insertValue);
      if (data) navigate(`/battle/${data.uuid}`);
    } else {
      navigate(`/login`);
    }
  };

  const themesDisplay = useMemo(() => {
    const idThemes = [271, 272];

    return themes.filter((el) => idThemes.includes(el.id));
  }, [themes]);

  return (
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
        <Typography variant="h2">{t("commun.gamemode")}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Box
          sx={{
            display: "flex",
            gap: px(5),
            overflowX: "auto",
            scrollbarWidth: "none",
          }}
        >
          {modes.map((mode, index) => (
            <Box key={index} sx={{ maxWidth: px(100) }}>
              <Box
                onClick={() => mode.onClick()}
                sx={{
                  width: percent(100),
                  display: "flex",
                  justifyContent: "center",
                  flexDirection: "column",
                  cursor: "pointer",
                  background: "rgba(255,255,255,.15)",
                  borderRadius: px(5),
                  gap: px(2),
                }}
              >
                <Box
                  sx={{
                    backgroundColor: mode.color,
                    width: 90,
                    aspectRatio: "1/1",
                    borderRadius: px(5),
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <img
                    src={mode.image}
                    loading="lazy"
                    style={{
                      maxWidth: percent(90),
                      maxHeight: Number.isFinite(90) ? Number(90) * 0.9 : 90,
                    }}
                  />
                </Box>
                <JsonLanguageBlock
                  variant="h6"
                  sx={{ textAlign: "center" }}
                  value={mode.name}
                />
              </Box>
            </Box>
          ))}
          {themesDisplay.map((theme) => (
            <CardTheme key={theme.id} theme={theme} />
          ))}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
