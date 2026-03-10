import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { selectListScoreByProfile } from "src/api/list";
import { ListScore } from "src/models/List";
import { useAuth } from "./AuthProviderSupabase";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const ListContext = createContext<{
  scores: Array<ListScore>;
}>({
  scores: [],
});

export const useList = () => useContext(ListContext);

export const ListProvider = ({ children }: Props) => {
  const { user } = useAuth();
  const [scores, setScores] = useState<Array<ListScore>>([]);

  useEffect(() => {
    const getScores = () => {
      if (user) {
        selectListScoreByProfile(user.id).then(({ data }) => {
          setScores(data ?? []);
        });
      }
    };
    getScores();
  }, [user]);

  const value = useMemo(
    () => ({
      scores,
    }),
    [scores],
  );

  return <ListContext.Provider value={value}>{children}</ListContext.Provider>;
};
