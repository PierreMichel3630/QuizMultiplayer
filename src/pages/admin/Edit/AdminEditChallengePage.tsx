import { Box, Grid, IconButton, Pagination, Typography } from "@mui/material";
import moment, { Moment } from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  countChallengeGameByDate,
  deleteChallengeGameById,
  selectChallengeGameByDatePaginate,
} from "src/api/challenge";
import {
  ChangeDateBlock,
  DateFormat,
} from "src/component/date/ChangeDateBlock";
import { BasicTable } from "src/component/table/BasicTable";
import { NUMBER_QUESTIONS_CHALLENGE } from "src/configuration/configuration";
import { ChallengeGame } from "src/models/Challenge";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { BasicSearchInput } from "src/component/Input";
import { ConfirmDialog } from "src/component/modal/ConfirmModal";
import { ProfileBlock } from "src/component/profile/ProfileBlock";
import { useMessage } from "src/context/MessageProvider";

export default function AdminEditChallengePage() {
  const { t } = useTranslation();
  const { setMessage, setSeverity } = useMessage();

  const ITEMPERPAGE = 10;
  const [search, setSearch] = useState("");
  const [count, setCount] = useState<number>(1);
  const [page, setPage] = useState<number>(1);

  const [date, setDate] = useState(moment());
  const [challengeGames, setChallengeGames] = useState<Array<ChallengeGame>>(
    []
  );
  const [challengeGame, setChallengeGame] = useState<ChallengeGame | null>(
    null
  );

  const columns = [
    { label: t("commun.profile"), key: "profile" },
    { label: t("commun.score"), key: "score" },
    { label: t("commun.time"), key: "time" },
    { label: "", key: "action" },
  ];

  const data = useMemo(() => {
    return [...challengeGames].map((el) => ({
      profile: (
        <ProfileBlock profile={el.profile} variant="h4" avatarSize={50} />
      ),
      score: (
        <Typography variant="h4" noWrap>
          {el.score} / {NUMBER_QUESTIONS_CHALLENGE}
        </Typography>
      ),
      time: (
        <Typography variant="h4" noWrap>
          {(el.time / 1000).toFixed(2)}s
        </Typography>
      ),
      action: (
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton aria-label="delete">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="delete" onClick={() => setChallengeGame(el)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    }));
  }, [challengeGames]);

  const getGames = (
    date: Moment,
    search: string,
    page: number,
    itemperpage: number
  ) => {
    selectChallengeGameByDatePaginate(date, search, page - 1, itemperpage).then(
      (res) => {
        setChallengeGames(res.data ?? []);
      }
    );
  };

  useEffect(() => {
    getGames(date, search, page, ITEMPERPAGE);
  }, [date, page, search]);

  useEffect(() => {
    countChallengeGameByDate(date, undefined, search).then(({ count }) => {
      setCount(count ?? 0);
    });
  }, [date, search]);

  const deleteChallengeGame = () => {
    if (challengeGame) {
      deleteChallengeGameById(challengeGame.id).then((res) => {
        if (res.error) {
          setSeverity("error");
          setMessage(t("commun.error"));
        } else {
          setPage(1);
          setSearch("");
          getGames(date, "", 1, ITEMPERPAGE);
          setChallengeGame(null);
        }
      });
    }
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <ChangeDateBlock
          date={date}
          format={DateFormat.DAY}
          onChange={(value) => {
            setPage(1);
            setDate(value);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        <BasicSearchInput
          label={t("commun.searchplayer")}
          onChange={(value) => {
            setPage(1);
            setSearch(value);
          }}
          value={search}
          clear={() => setSearch("")}
        />
      </Grid>
      <Grid item xs={12} sx={{ mb: 6 }}>
        <BasicTable columns={columns} data={data} />
      </Grid>
      <Box
        sx={{
          position: "fixed",
          bottom: 80,
          left: 5,
          right: 5,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={count ? Math.ceil(count / ITEMPERPAGE) : 1}
          page={page}
          onChange={(_event: React.ChangeEvent<unknown>, value: number) =>
            setPage(value)
          }
          variant="outlined"
          shape="rounded"
          sx={{
            backgroundColor: "background.paper",
          }}
        />
      </Box>
      <ConfirmDialog
        title={t("modal.delete")}
        open={challengeGame !== null}
        extra={
          challengeGame ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
              }}
            >
              <ProfileBlock
                profile={challengeGame.profile}
                variant="h4"
                avatarSize={50}
              />
              <Typography variant="h2" noWrap>
                {challengeGame.score} / {NUMBER_QUESTIONS_CHALLENGE}
              </Typography>
            </Box>
          ) : undefined
        }
        onClose={() => setChallengeGame(null)}
        onConfirm={deleteChallengeGame}
      />
    </Grid>
  );
}
