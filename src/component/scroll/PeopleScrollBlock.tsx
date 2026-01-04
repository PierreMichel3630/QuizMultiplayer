import { Alert, Grid } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { countProfile, searchProfilePagination } from "src/api/profile";
import { Profile } from "src/models/Profile";
import { BasicCardProfile } from "../card/CardProfile";
import { SkeletonPlayers } from "../skeleton/SkeletonPlayer";
import { TitleCount } from "../title/TitleCount";

interface Props {
  search: string;
}
export const PeopleScrollBlock = ({ search }: Props) => {
  const { t } = useTranslation();

  const observer = useRef<IntersectionObserver | null>(null);
  const lastItemRef = useRef<HTMLTableRowElement | null>(null);

  const ITEMPERPAGE = 25;

  const [players, setPlayers] = useState<Array<Profile>>([]);
  const [nbPlayers, setNbPlayers] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);

  const getPlayers = useCallback(
    (page: number) => {
      if (isLoading) return;
      if (page === 0 || !isEnd) {
        setIsLoading(true);
        searchProfilePagination(search, [], page, ITEMPERPAGE).then(
          ({ data }) => {
            const result = data !== null ? (data as Array<Profile>) : [];
            setPlayers((prev) =>
              page === 0 ? [...result] : [...prev, ...result]
            );
            setIsEnd(result.length < ITEMPERPAGE);
            setIsLoading(false);
          }
        );
      }
    },
    [isEnd, search, isLoading]
  );

  useEffect(() => {
    const countPlayers = () => {
      countProfile(search).then(({ count }) => {
        setNbPlayers(count ?? 0);
      });
    };
    countPlayers();
  }, [search]);

  useEffect(() => {
    setPage(0);
    setPlayers([]);
    setIsEnd(false);
    getPlayers(0);
  }, [search]);

  useEffect(() => {
    if (isLoading) return;

    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !isEnd) {
        setPage((prev) => {
          getPlayers(prev + 1);
          return prev + 1;
        });
      }
    });

    if (lastItemRef.current) {
      observer.current.observe(lastItemRef.current);
    }

    return () => observer.current?.disconnect();
  }, [isLoading, isEnd, getPlayers]);

  return (
    <Grid container spacing={1}>
      <Grid size={12}>
        <TitleCount title={t("commun.players")} count={nbPlayers} />
      </Grid>
      {isEnd && players.length === 0 ? (
        <Grid size={12}>
          <Alert severity="warning">{t("commun.noresult")}</Alert>
        </Grid>
      ) : (
        <>
          {players.map((player, index) => (
            <Grid
              key={index}
              ref={index === players.length - 1 ? lastItemRef : null}
              size={12}>
              <BasicCardProfile profile={player} />
            </Grid>
          ))}
          {isLoading && <SkeletonPlayers number={3} />}
        </>
      )}
    </Grid>
  );
};
