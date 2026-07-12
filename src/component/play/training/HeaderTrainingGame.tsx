import { useMemo } from "react";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { Profile } from "src/models/Profile";

interface Props {
  goodAnswer: number;
  badAnswer: number;
  profile: Profile | null;
}

export const HeaderTrainingGame = ({
  profile,
  goodAnswer,
  badAnswer,
}: Props) => {
  const numberQuestions = useMemo(
    () => goodAnswer + badAnswer,
    [goodAnswer, badAnswer],
  );

  return (
    profile && (
      <ScoreThemeBlock
        profile={profile}
        score={`${goodAnswer} / ${numberQuestions} `}
      />
    )
  );
};
