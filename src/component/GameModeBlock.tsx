import { Box, Divider, Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { insertBattleGame } from "src/api/game";
import { selectThemesById } from "src/api/theme";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { TypeCardEnum } from "src/models/enum/TypeCardEnum";
import { CardImage, ICardImage } from "./card/CardImage";
import { TitleCount } from "./title/TitleCount";

interface Mode {
  id: number;
  image: string;
  color: string;
  name: string;
  onClick: () => void;
}

export const GameModeBlock = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { language } = useUser();
  const navigate = useNavigate();

  const [themes, setThemes] = useState<Array<ICardImage>>([]);

  const launchBattleGame = useCallback(async () => {
    if (profile) {
      const insertValue = {
        player1: profile.id,
      };
      const { data } = await insertBattleGame(insertValue);
      if (data) {
        navigate(`/battle/${data.uuid}`);
      }
    } else {
      navigate(`/login`);
    }
  }, [profile, navigate]);

  const modes: Array<Mode> = useMemo(
    () => [
      {
        id: 0,
        image:
          "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/theme/mode/swords.png",
        color: "#a569bd",
        name: t("mode.fightfriend"),
        onClick: () => launchBattleGame(),
      },
    ],
    [launchBattleGame, t]
  );

  useEffect(() => {
    const idThemes = [271, 272];
    if (language) {
      selectThemesById(idThemes, language.iso).then(({ data }) => {
        const res = data ?? [];
        setThemes(
          [...res].map((el) => ({
            id: el.id,
            name: el.title,
            image: el.image,
            color: el.color,
            link: `/theme/${el.id}`,
            type: TypeCardEnum.THEME,
          }))
        );
      });
    }
  }, [language]);

  const count = useMemo(() => themes.length + modes.length, [themes, modes]);

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <TitleCount title={t("commun.gamemode")} count={count} />
      </Grid>
      <Grid size={12}>
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
      <Grid size={12}>
        <Divider sx={{ borderBottomWidth: 5 }} />
      </Grid>
    </Grid>
  );
};
