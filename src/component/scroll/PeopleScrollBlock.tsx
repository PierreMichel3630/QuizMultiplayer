import { useState, useEffect, useCallback } from "react";
import { countProfile, searchProfilePagination } from "src/api/profile";
import { Profile } from "src/models/Profile";
import InfiniteScroll from "react-infinite-scroll-component";
import { SkeletonPlayers } from "../skeleton/SkeletonPlayer";
import { Alert, Grid } from "@mui/material";
import { BasicCardProfile } from "../card/CardProfile";
import { TitleCount } from "../title/TitleCount";
import { useTranslation } from "react-i18next";

interface Props {
  search: string;
}
export const PeopleScrollBlock = ({ search }: Props) => {
  const { t } = useTranslation();
  const ITEMPERPAGE = 25;

  const [, setPage] = useState(0);
  const [players, setPlayers] = useState<Array<Profile>>([]);
  const [nbPlayers, setNbPlayers] = useState<number>(0);
  const [isEnd, setIsEnd] = useState(false);

  const getPlayers = useCallback(
    (page: number) => {
      if (!isEnd) {
        searchProfilePagination(search, [], page, ITEMPERPAGE).then(
          ({ data }) => {
            const result = data !== null ? (data as Array<Profile>) : [];
            setPlayers((prev) => [...prev, ...result]);
            setIsEnd(result.length < ITEMPERPAGE);
          }
        );
      }
    },
    [isEnd, search]
  );

  const handleLoadMoreData = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      getPlayers(nextPage);
      return nextPage;
    });
  };
  useEffect(() => {
    const countPlayers = () => {
      countProfile(search).then(({ count }) => {
        setNbPlayers(count ?? 0);
      });
    };
    countPlayers();
    getPlayers(0);
  }, [getPlayers, search]);

  useEffect(() => {
    setPage(0);
    setPlayers([]);
    setIsEnd(false);
  }, [search]);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <TitleCount title={t("commun.players")} count={nbPlayers} />
      </Grid>
      {isEnd && players.length === 0 ? (
        <Grid item xs={12}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      ) : (
        <Grid item xs={12}>
          <InfiniteScroll
            dataLength={players.length}
            next={handleLoadMoreData}
            hasMore={!isEnd}
            loader={<SkeletonPlayers number={3} />}
          >
            <Grid container spacing={1} sx={{ mb: 1 }}>
              {players.map((player, index) => (
                <Grid item key={index} xs={12}>
                  <BasicCardProfile profile={player} />
                </Grid>
              ))}
            </Grid>
          </InfiniteScroll>
        </Grid>
      )}
    </Grid>
  );
};
