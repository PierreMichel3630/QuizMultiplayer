import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { GAMES_MODE } from "src/utils/mode";

export const useGames = () => {
  const { t } = useTranslation();

  const games = useMemo(() => 
    GAMES_MODE.map(game => ({
      ...game,
      name: t(`gamemode.${game.translationKey}.name`),
      description: t(`gamemode.${game.translationKey}.description`),
    })), 
  [t]);

  return games;
};