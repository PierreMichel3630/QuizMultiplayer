import {
  Alert,
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { Theme } from "src/models/Theme";

import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { padding, px } from "csx";
import { useCallback, useEffect, useState } from "react";
import { selectGames } from "src/api/game";
import { CardHistoryGameAdmin } from "src/component/card/CardHistoryGame";
import { SelectFriendModal } from "src/component/modal/SelectFriendModal";
import { AutocompleteTheme } from "src/component/Select";
import { SelectorProfileBlock } from "src/component/SelectorProfileBlock";
import { SkeletonGames } from "src/component/skeleton/SkeletonGame";
import { HistoryGame } from "src/models/Game";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

export interface FilterGameAdmin {
  type: "ALL" | "DUEL" | "SOLO";
  themes: Array<Theme>;
  player?: Profile;
  opponent?: Profile;
}
export default function AdminImagesPage() {
  const { t } = useTranslation();

  const ITEMPERPAGE = 25;

  const [games, setGames] = useState<Array<HistoryGame>>([]);
  const [page, setPage] = useState(0);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterGameAdmin>({
    type: "ALL",
    themes: [],
    player: undefined,
    opponent: undefined,
  });
  const [openModalFriend1, setOpenModalFriend1] = useState(false);
  const [openModalFriend2, setOpenModalFriend2] = useState(false);

  const getGames = useCallback(() => {
    setIsLoading(true);
    selectGames(filter, page, ITEMPERPAGE).then(({ data }) => {
      const result = data as Array<HistoryGame>;
      setGames((prev) => (page === 0 ? [...result] : [...prev, ...result]));
      setIsEnd(result.length === 0);
      setIsLoading(false);
    });
  }, [page, filter]);

  useEffect(() => {
    if (!isEnd) {
      getGames();
    }
  }, [isEnd, page, getGames]);

  useEffect(() => {
    setIsLoading(true);
    setGames([]);
    setPage(0);
    setIsEnd(false);
  }, [filter]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 250 <=
        document.documentElement.offsetHeight
      ) {
        return;
      }
      if (!isEnd && !isLoading) setPage((prev) => prev + 1);
    };
    if (document) {
      document.addEventListener("scroll", handleScroll);
    }
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [isEnd, isLoading]);

  /*
  useEffect(() => {
    selectImageQuestion(i).then(({ data }) => {
      const urls: Array<string> = data ? data.map((el) => el.image) : [];
      testImages(urls).then((res) => {
        console.log(res);
      });
    });
  }, [isImage]);
  */

  return (
    <Grid container>
      <Grid
        item
        xs={12}
        sx={{
          position: "sticky",
          top: px(55),
          p: 1,
          backgroundColor: Colors.white,
          display: "flex",
          justifyContent: "center",
          zIndex: 10,
        }}
      >
        <Grid container spacing={1} justifyContent="center" alignItems="center">
          <Grid item xs={12} sx={{ display: "flex", justifyContent: "center" }}>
            <ToggleButtonGroup
              color="primary"
              value={filter.type}
              exclusive
              onChange={(
                _event: React.MouseEvent<HTMLElement>,
                newType: "ALL" | "DUEL" | "SOLO"
              ) => {
                setFilter((prev) => ({
                  ...prev,
                  type: newType,
                  opponent: newType === "DUEL" ? prev.opponent : undefined,
                }));
              }}
            >
              <ToggleButton value="ALL" sx={{ p: padding(5, 10) }}>
                <Typography variant="h6">{t("commun.all")}</Typography>
              </ToggleButton>
              <ToggleButton value="SOLO" sx={{ p: padding(5, 10) }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <PlayCircleIcon fontSize="small" />
                  <Typography variant="h6">{t("commun.solo")}</Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="DUEL" sx={{ p: padding(5, 10) }}>
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <OfflineBoltIcon fontSize="small" />
                  <Typography variant="h6">{t("commun.duel")}</Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Grid>
          <Grid item xs={filter.type === "DUEL" ? 6 : 12}>
            <SelectorProfileBlock
              label={t("commun.selectplayer")}
              profile={filter.player}
              onChange={() => setOpenModalFriend1(true)}
              onDelete={() =>
                setFilter((prev) => ({ ...prev, player: undefined }))
              }
            />
          </Grid>
          {filter.type === "DUEL" && (
            <Grid item xs={6}>
              <SelectorProfileBlock
                label={t("commun.selectopponent")}
                profile={filter.opponent}
                onChange={() => setOpenModalFriend2(true)}
                onDelete={() =>
                  setFilter((prev) => ({ ...prev, opponent: undefined }))
                }
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <AutocompleteTheme
              value={filter.themes}
              onChange={(value: Array<Theme>) => {
                setFilter((prev) => ({ ...prev, themes: value }));
              }}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ p: 1 }}>
          <Grid container spacing={1}>
            {games.map((game) => (
              <Grid item xs={12} key={game.uuid}>
                <CardHistoryGameAdmin game={game} />
              </Grid>
            ))}
            {isLoading && <SkeletonGames number={10} />}
            {!isLoading && games.length === 0 && isEnd && (
              <Grid item xs={12}>
                <Alert severity="warning">{t("commun.noresult")}</Alert>
              </Grid>
            )}
          </Grid>
        </Box>
      </Grid>
      <SelectFriendModal
        open={openModalFriend1}
        close={() => setOpenModalFriend1(false)}
        onValid={(profile) => {
          setFilter((prev) => ({ ...prev, player: profile }));
          setOpenModalFriend1(false);
        }}
        withMe={true}
      />
      <SelectFriendModal
        open={openModalFriend2}
        close={() => setOpenModalFriend2(false)}
        onValid={(profile) => {
          setFilter((prev) => ({ ...prev, opponent: profile }));
          setOpenModalFriend2(false);
        }}
        withMe={false}
      />
    </Grid>
  );
}
