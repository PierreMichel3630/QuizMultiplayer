import { Box, Divider, Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { insertBattleGame } from "src/api/game";
import { selectThemesById } from "src/api/theme";
import { useAuth } from "src/context/AuthProviderSupabase";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { JsonLanguage } from "src/models/Language";
import { CardImage, ICardImage } from "./card/CardImage";
import { TitleCount } from "./title/TitleCount";

interface Mode {
  id: number;
  image: string;
  color: string;
  name: JsonLanguage;
  onClick: () => void;
}

export const GameModeBlock = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [themes, setThemes] = useState<Array<ICardImage>>([]);

  const launchBattleGame = useCallback(async () => {
    if (user) {
      const insertValue = {
        player1: user.id,
      };
      const { data } = await insertBattleGame(insertValue);
      if (data) navigate(`/battle/${data.uuid}`);
    } else {
      navigate(`/login`);
    }
  }, [user, navigate]);

  const modes: Array<Mode> = useMemo(
    () => [
      {
        id: 0,
        image:
          "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/theme/mode/swords.png",
        color: "#a569bd",
        name: {
          "fr-FR": "Combat contre un ami",
          "en-US": "Fight against a friend",
        },
        onClick: () => launchBattleGame(),
      },
    ],
    [launchBattleGame]
  );

  useEffect(() => {
    const idThemes = [271, 272];
    selectThemesById(idThemes).then(({ data }) => {
      const res = data ?? [];
      setThemes(
        [...res].map((el) => ({
          id: el.id,
          name: el.name,
          image: el.image,
          color: el.color,
          link: `/theme/${el.id}`,
          type: TypeCardEnum.THEME,
        }))
      );
    });
  }, []);

  const count = useMemo(() => themes.length + modes.length, [themes, modes]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TitleCount title={t("commun.gamemode")} count={count} />
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
          {modes.map((mode, index) => (
            <Box
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                mode.onClick();
              }}
              key={index}
            >
              <CardImage value={mode} />
            </Box>
          ))}
          {themes.map((theme) => (
            <CardImage key={theme.id} value={theme} />
          ))}
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
