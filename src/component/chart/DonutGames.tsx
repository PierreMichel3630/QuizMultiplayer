import { useUser } from "src/context/UserProvider";
import { MyScore } from "src/models/Score";
import { Theme } from "src/models/Theme";
import { DonutChart } from "./DonutChart";
import { useTranslation } from "react-i18next";
import { sortByValue } from "src/utils/sort";

interface Props {
  stats: Array<MyScore>;
  themes: Array<Theme>;
}
export const DonutGames = ({ stats, themes }: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const data = themes
    .map((theme) => {
      const label = theme.name[language.iso]
        ? theme.name[language.iso]
        : theme.name["fr-FR"];
      const stat = stats.find((el) => el.theme === theme.id);
      return {
        name: label,
        value: stat ? stat.games : 0,
        color: theme.color,
      };
    })
    .sort(sortByValue);

  return (
    <DonutChart
      data={data.filter((el) => el.value !== 0)}
      title={t("commun.gamesplay")}
    />
  );
};
