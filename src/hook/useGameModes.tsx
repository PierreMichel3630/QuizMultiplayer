import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { insertBattleGame } from "src/api/game";
import { selectThemesByIds } from "src/api/theme";
import { ICardImageOrder } from "src/component/card/CardImage";
import { useAuth } from "src/context/AuthProviderSupabase";
import { useUser } from "src/context/UserProvider";
import { SearchType } from "src/models/enum/TypeCardEnum";
import { sortByOrderAndName } from "src/utils/sort";

import BrainTest from "src/assets/mode/braintest.png";
import ListMode from "src/assets/mode/list.png";
import { Colors } from "src/style/Colors";

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

  const goTo = useCallback(
    (value: string) => {
      navigate(value);
    },
    [navigate],
  );

  const modes: Array<ICardImageOrder> = useMemo(
    () => [
      {
        id: 0,
        image:
          "https://cperjgnbmoqyyqgkyqws.supabase.co/storage/v1/object/public/theme/mode/swords.png",
        color: "#a569bd",
        name: t("mode.fightfriend"),
        onClick: launchBattleGame,
        type: SearchType.GAMEMODE,
        order: 3,
        created_at: new Date(2024, 7, 23),
      },
      {
        id: 1,
        image: ListMode,
        color: Colors.colorList,
        name: t("mode.list"),
        onClick: () => goTo(`/list`),
        type: SearchType.GAMEMODE,
        order: 2,
        created_at: new Date(2026, 1, 23),
      },
      {
        id: 2,
        image: BrainTest,
        color: Colors.colorBrainTest,
        name: t("mode.braintest"),
        onClick: () => goTo(`/braintest`),
        type: SearchType.GAMEMODE,
        order: 1,
        created_at: new Date(2026, 3, 12),
      },
    ],
    [launchBattleGame, goTo, t],
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
            type: SearchType.GAMEMODE,
            order: 3,
            created_at: el.created_at,
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
