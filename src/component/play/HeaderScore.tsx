import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScoreThemeBlock } from "src/component/ScoreThemeBlock";
import { Profile } from "src/models/Profile";
import { InvertInfoBlock } from "../InfoBlock";

interface PropsHeaderTrainingGame {
  goodAnswer: number;
  badAnswer: number;
  profile: Profile | null;
}

export const HeaderTrainingGame = ({
  profile,
  goodAnswer,
  badAnswer,
}: PropsHeaderTrainingGame) => {
  const numberQuestions = useMemo(
    () => goodAnswer + badAnswer,
    [goodAnswer, badAnswer],
  );

  return (
    <ScoreThemeBlock
      profile={profile}
      score={`${goodAnswer} / ${numberQuestions}`}
    />
  );
};

interface PropsHeaderChallengeGame {
  goodAnswer: number;
  badAnswer: number;
  profile: Profile | null;
  startTimeRef: React.RefObject<number | null>;
  running: boolean;
}

export const HeaderChallengeGame = ({
  profile,
  goodAnswer,
  badAnswer,
  startTimeRef,
  running,
}: PropsHeaderChallengeGame) => {
  const numberQuestions = useMemo(
    () => goodAnswer + badAnswer,
    [goodAnswer, badAnswer],
  );

  return (
    <ScoreThemeBlock
      profile={profile}
      score={`${goodAnswer} / ${numberQuestions} `}
      extra={<TimerChallenge startTimeRef={startTimeRef} running={running} />}
    />
  );
};

interface PropsTimerChallenge {
  startTimeRef: React.RefObject<number | null>;
  running: boolean;
}
const TimerChallenge = ({ startTimeRef, running }: PropsTimerChallenge) => {
  const { t } = useTranslation();

  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running || startTimeRef.current == null) {
      return;
    }

    const update = () => {
      setSeconds(Math.floor((Date.now() - startTimeRef.current!) / 1000));
    };

    update();

    const interval = setInterval(update, 1000);

    return () => clearInterval(interval);
  }, [running]);

  return (
    <InvertInfoBlock
      title={t("commun.time")}
      value={`${seconds}s`}
      minWidth={55}
    />
  );
};
