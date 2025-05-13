import moment from "moment";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  selectFirstRankingChallengeByAllTime,
  selectFirstRankingChallengeByDay,
  selectFirstRankingChallengeByMonth,
  selectFirstRankingChallengeByWeek,
  selectLastRankingChallengeByAllTime,
  selectLastRankingChallengeByDay,
  selectLastRankingChallengeByMonth,
  selectLastRankingChallengeByWeek,
} from "src/api/challenge";
import {
  ChallengeRankingAllTime,
  ChallengeRankingDate,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const ChallengeContext = createContext<{
  winDay: ChallengeRankingDate | undefined;
  winWeek: ChallengeRankingWeek | undefined;
  winMonth: ChallengeRankingMonth | undefined;
  winAllTime: ChallengeRankingAllTime | undefined;
  loseDay: ChallengeRankingDate | undefined;
  loseWeek: ChallengeRankingWeek | undefined;
  loseMonth: ChallengeRankingMonth | undefined;
  loseAllTime: ChallengeRankingAllTime | undefined;
}>({
  winDay: undefined,
  winWeek: undefined,
  winMonth: undefined,
  winAllTime: undefined,
  loseDay: undefined,
  loseWeek: undefined,
  loseMonth: undefined,
  loseAllTime: undefined,
});

export const useChallenge = () => useContext(ChallengeContext);

export const ChallengeProvider = ({ children }: Props) => {
  const [winDay, setWinDay] = useState<ChallengeRankingDate | undefined>(
    undefined
  );
  const [winWeek, setWinWeek] = useState<ChallengeRankingWeek | undefined>(
    undefined
  );
  const [winMonth, setWinMonth] = useState<ChallengeRankingMonth | undefined>(
    undefined
  );
  const [winAllTime, setWinAllTime] = useState<
    ChallengeRankingAllTime | undefined
  >(undefined);

  const [loseDay, setLoseDay] = useState<ChallengeRankingDate | undefined>(
    undefined
  );
  const [loseWeek, setLoseWeek] = useState<ChallengeRankingWeek | undefined>(
    undefined
  );
  const [loseMonth, setLoseMonth] = useState<ChallengeRankingMonth | undefined>(
    undefined
  );
  const [loseAllTime, setLoseAllTime] = useState<
    ChallengeRankingAllTime | undefined
  >(undefined);

  useEffect(() => {
    const getRankingDay = () => {
      const date = moment().subtract(1, "day");
      selectFirstRankingChallengeByDay(date.format("YYYY-MM-DD")).then(
        ({ data }) => {
          setWinDay(data);
        }
      );
      selectLastRankingChallengeByDay(date.format("YYYY-MM-DD")).then(
        ({ data }) => {
          setLoseDay(data);
        }
      );
    };
    const getRankingWeek = () => {
      const date = moment().subtract(1, "weeks");
      selectFirstRankingChallengeByWeek(date.format("WW/YYYY")).then(
        ({ data }) => {
          setWinWeek(data);
        }
      );
      selectLastRankingChallengeByWeek(date.format("WW/YYYY")).then(
        ({ data }) => {
          setLoseWeek(data);
        }
      );
    };
    const getRankingMonth = () => {
      const date = moment().subtract(1, "month");
      selectFirstRankingChallengeByMonth(date.format("MM/YYYY")).then(
        ({ data }) => {
          setWinMonth(data);
        }
      );
      selectLastRankingChallengeByMonth(date.format("MM/YYYY")).then(
        ({ data }) => {
          setLoseMonth(data);
        }
      );
    };
    const getRankingAllTime = () => {
      selectFirstRankingChallengeByAllTime().then(({ data }) => {
        setWinAllTime(data);
      });
      selectLastRankingChallengeByAllTime().then(({ data }) => {
        setLoseAllTime(data);
      });
    };
    getRankingDay();
    getRankingWeek();
    getRankingMonth();
    getRankingAllTime();
  }, []);

  const value = useMemo(
    () => ({
      winDay,
      winWeek,
      winMonth,
      winAllTime,
      loseDay,
      loseWeek,
      loseMonth,
      loseAllTime,
    }),
    [
      loseAllTime,
      loseDay,
      loseMonth,
      loseWeek,
      winAllTime,
      winDay,
      winMonth,
      winWeek,
    ]
  );

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};
