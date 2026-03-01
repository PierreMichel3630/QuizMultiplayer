import { green } from "@mui/material/colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { insertBattleGame } from "src/api/game";
import { selectThemesByIds } from "src/api/theme";
import { ICardImageOrder } from "src/component/card/CardImage";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { GameMode } from "src/models/GameMode";
import { sortByOrderAndName } from "src/utils/sort";

import ListMode from "src/assets/mode/list.png";

export const useGameModes = () => {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const { language } = useUser();
  const navigate = useNavigate();

  const [themes, setThemes] = useState<Array<ICardImageOrder>>([]);

  const launchBattleGame = useCallback(async () => {
    if (profile) {
      const { data } = await insertBattleGame({
        player1: profile.id,
      });

      if (data) {
        navigate(`/battle/${data.uuid}`);
      }
    } else {
      navigate(`/login`);
    }
  }, [profile, navigate]);

  const goList = useCallback(() => {
    navigate(`/list`);
  }, [navigate]);

  const modes: Array<GameMode> = useMemo(
    () => [
      {
        id: 0,
        image:
          "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/theme/mode/swords.png",
        color: "#a569bd",
        name: t("mode.fightfriend"),
        onClick: launchBattleGame,
        type: SearchType.GAMEMODE,
        order: 2,
        created_at:  new Date(2024, 7, 23)
      },
      {
        id: 1,
        image: ListMode,
        color: green["A400"],
        name: t("mode.list"),
        onClick: goList,
        type: SearchType.GAMEMODE,
        order: 1,
        created_at: new Date(2026, 2, 23)
      },
    ],
    [launchBattleGame, goList, t],
  );

  useEffect(() => {
    const idThemes = [271, 272];

    if (language) {
      selectThemesByIds(idThemes).then(({ data }) => {
        const res = data ?? [];

        setThemes(
          res.map((el) => ({
            id: el.id,
            name: el.title,
            image: el.image,
            color: el.color,
            link: `/theme/${el.id}`,
            type: SearchType.THEME,
            order: 3,
            created_at: el.created_at
          })),
        );
      });
    }
  }, [language]);

  const allValues = useMemo(
    () => [...themes, ...modes].sort(sortByOrderAndName),
    [themes, modes],
  );

  return {
    themes,
    modes,
    allValues,
    count: themes.length + modes.length,
  };
};
