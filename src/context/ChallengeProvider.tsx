import moment from "moment";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  selectChallengeMonthPaginate,
  selectChallengeWeekPaginate,
  selectFirstRankingChallengeByDay,
} from "src/api/challenge";
import {
  ChallengeGame,
  ChallengeRankingMonth,
  ChallengeRankingWeek
} from "src/models/Challenge";
import { useUser } from "./UserProvider";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const ChallengeContext = createContext<{
  winDay: ChallengeGame | undefined;
  winWeek: ChallengeRankingWeek | undefined;
  winMonth: ChallengeRankingMonth | undefined;
}>({
  winDay: undefined,
  winWeek: undefined,
  winMonth: undefined,
});

export const useChallenge = () => useContext(ChallengeContext);

export const ChallengeProvider = ({ children }: Props) => {
  const { language } = useUser();
  const [winDay, setWinDay] = useState<ChallengeGame | undefined>(
    undefined,
  );
  const [winWeek, setWinWeek] = useState<ChallengeRankingWeek | undefined>(
    undefined,
  );
  const [winMonth, setWinMonth] = useState<ChallengeRankingMonth | undefined>(
    undefined,
  );

  useEffect(() => {
    const getRankingDay = () => {
      const date = moment().subtract(1, "day");
      selectFirstRankingChallengeByDay(date.format("YYYY-MM-DD")).then(
        ({ data }) => {
          setWinDay(data);
        },
      );
    };
    const getRankingWeek = () => {
      const date = moment().subtract(1, "weeks");
      selectChallengeWeekPaginate(
        date.format("WW/YYYY"),
        "",
        "score",
        false,
        0,
        1,
      ).then(({ data }) => {
        if (data?.data.length === 1) {
          setWinWeek(data?.data[0]);
        }
      });
    };
    const getRankingMonth = () => {
      const date = moment().subtract(1, "month");
      selectChallengeMonthPaginate(
        date.format("MM/YYYY"),
        "",
        "score",
        false,
        0,
        1,
      ).then(({ data }) => {
        if (data?.data.length === 1) {
          setWinMonth(data?.data[0]);
        }
      });
    };
    getRankingDay();
    getRankingWeek();
    getRankingMonth();
  }, [language]);

  const value = useMemo(
    () => ({
      winDay,
      winWeek,
      winMonth,
    }),
    [winDay, winMonth, winWeek],
  );

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};
