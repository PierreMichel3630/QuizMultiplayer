import moment from "moment";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  selectBestRankingChallengeByDay,
  selectBestRankingChallengeByMonth,
  selectBestRankingChallengeByWeek,
  selectFirstRankingChallengeByDay,
  selectFirstRankingChallengeByMonth,
  selectFirstRankingChallengeByWeek,
} from "src/api/challenge";
import {
  ChallengeRankingDay,
  ChallengeRankingMonth,
  ChallengeRankingWeek,
} from "src/models/Challenge";
import { useUser } from "./UserProvider";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const ChallengeContext = createContext<{
  winDay: ChallengeRankingDay | undefined;
  winWeek: ChallengeRankingWeek | undefined;
  winMonth: ChallengeRankingMonth | undefined;
  allTimeDay: ChallengeRankingDay | undefined;
  allTimeWeek: ChallengeRankingWeek | undefined;
  allTimeMonth: ChallengeRankingMonth | undefined;
}>({
  winDay: undefined,
  winWeek: undefined,
  winMonth: undefined,
  allTimeDay: undefined,
  allTimeWeek: undefined,
  allTimeMonth: undefined,
});

export const useChallenge = () => useContext(ChallengeContext);

export const ChallengeProvider = ({ children }: Props) => {
  const { language } = useUser();
  const [winDay, setWinDay] = useState<ChallengeRankingDay | undefined>(
    undefined
  );
  const [winWeek, setWinWeek] = useState<ChallengeRankingWeek | undefined>(
    undefined
  );
  const [winMonth, setWinMonth] = useState<ChallengeRankingMonth | undefined>(
    undefined
  );

  const [allTimeDay, setAllTimeDay] = useState<ChallengeRankingDay | undefined>(
    undefined
  );
  const [allTimeWeek, setAllTimeWeek] = useState<
    ChallengeRankingWeek | undefined
  >(undefined);
  const [allTimeMonth, setAllTimeMonth] = useState<
    ChallengeRankingMonth | undefined
  >(undefined);

  useEffect(() => {
    const getRankingDay = () => {
      const date = moment().subtract(1, "day");
      selectFirstRankingChallengeByDay(date.format("YYYY-MM-DD")).then(
        ({ data }) => {
          setWinDay(data);
        }
      );
      selectBestRankingChallengeByDay().then(({ data }) => {
        setAllTimeDay(data);
      });
    };
    const getRankingWeek = () => {
      const date = moment().subtract(1, "weeks");
      selectFirstRankingChallengeByWeek(date.format("WW/YYYY")).then(
        ({ data }) => {
          setWinWeek(data);
        }
      );
      selectBestRankingChallengeByWeek().then(({ data }) => {
        setAllTimeWeek(data);
      });
    };
    const getRankingMonth = () => {
      const date = moment().subtract(1, "month");
      selectFirstRankingChallengeByMonth(date.format("MM/YYYY")).then(
        ({ data }) => {
          setWinMonth(data);
        }
      );
      selectBestRankingChallengeByMonth().then(({ data }) => {
        setAllTimeMonth(data);
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
      allTimeDay,
      allTimeWeek,
      allTimeMonth,
    }),
    [allTimeDay, allTimeWeek, allTimeMonth, winDay, winMonth, winWeek]
  );

  return (
    <ChallengeContext.Provider value={value}>
      {children}
    </ChallengeContext.Provider>
  );
};
