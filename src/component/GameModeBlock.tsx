import { Grid } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { insertBattleGame } from "src/api/game";
import { selectThemesByIdAndLanguage } from "src/api/theme";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { sortByName } from "src/utils/sort";
import { ICardImage } from "./card/CardImage";
import { CategoryBlock } from "./category/CategoryBlock";
import { GameMode } from "src/models/GameMode";

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

  const modes: Array<GameMode> = useMemo(
    () => [
      {
        id: 0,
        image:
          "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/theme/mode/swords.png",
        color: "#a569bd",
        name: t("mode.fightfriend"),
        onClick: () => launchBattleGame(),
        type: SearchType.GAMEMODE,
      },
    ],
    [launchBattleGame, t]
  );

  useEffect(() => {
    const idThemes = [271, 272];
    if (language) {
      selectThemesByIdAndLanguage(idThemes, language.iso).then(({ data }) => {
        const res = data ?? [];
        setThemes(
          [...res].map((el) => ({
            id: el.id,
            name: el.title,
            image: el.image,
            color: el.color,
            link: `/theme/${el.id}`,
            type: SearchType.THEME,
          }))
        );
      });
    }
  }, [language]);

  const count = useMemo(() => themes.length + modes.length, [themes, modes]);

  const allValues = useMemo(
    () => [...themes, ...modes].sort(sortByName),
    [themes, modes]
  );

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        {allValues.length > 0 && (
          <CategoryBlock
            title={t("commun.gamemode")}
            count={count}
            link={`/gamemode`}
            values={allValues}
          />
        )}
      </Grid>
    </Grid>
  );
};
