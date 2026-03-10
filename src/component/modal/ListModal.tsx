import { CircularProgress, Dialog, Grid, Typography } from "@mui/material";
import { Trans, useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";

import CancelIcon from "@mui/icons-material/Cancel";
import ReplayIcon from "@mui/icons-material/Replay";
import { Box } from "@mui/system";
import { important, px } from "csx";
import { useMemo } from "react";
import { ResultScoreList } from "src/models/List";
import { ResultGameList } from "src/pages/modes/list/ListPage";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import QuestionMarkIcon from "@mui/icons-material/QuestionMark";
import { ChangeNumberBlock, Order } from "../ChangeBlock";
import { MyExperienceSoloBlock } from "../ExperienceBlock";
import { AddMoneyBlock } from "../MoneyBlock";

interface Props {
  open: boolean;
  data: ResultScoreList | null;
  result: ResultGameList | null;
  total: number;
  handleClose: () => void;
  retry: () => void;
}

export const DialogResultListModal = ({
  open,
  data,
  total,
  result,
  handleClose,
  retry,
}: Props) => {
  const { t } = useTranslation();

  const hasNewRecord = useMemo(
    () =>
      data?.hasrecordattempts || data?.hasrecordscore || data?.hasrecordtime,
    [data],
  );
  return (
    <Dialog onClose={handleClose} open={open}>
      <Box sx={{ p: 1 }}>
        {data === null ? (
          <Box
            sx={{
              minWidth: px(200),
              height: px(200),
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <CircularProgress size={100} color="secondary" />
          </Box>
        ) : (
          <Grid container spacing={1}>
            {hasNewRecord ? (
              <Grid
                size={12}
                sx={{ color: Colors.correctanswer, textAlign: "center" }}
              >
                <Typography
                  variant="h2"
                  textAlign="center"
                  sx={{ fontSize: important(px(45)) }}
                >
                  {t("commun.win")}
                </Typography>
                <Typography>{t("commun.newrecord")}</Typography>
              </Grid>
            ) : (
              <Grid
                size={12}
                sx={{ color: Colors.wronganswer, textAlign: "center" }}
              >
                <Typography
                  variant="h2"
                  textAlign="center"
                  sx={{ fontSize: important(px(45)) }}
                >
                  {t("commun.loose")}
                </Typography>
                <Typography>{t("commun.norecordbroken")}</Typography>
              </Grid>
            )}
            {result && (
              <>
                <Grid size={12}>
                  <MyExperienceSoloBlock
                    xp={{
                      match: 50,
                      matchscore: 5 * result.score,
                      record: hasNewRecord ? 100 : undefined
                    }}
                  />
                </Grid>
                <Grid
                  sx={{ display: "flex", justifyContent: "center" }}
                  size={12}
                >
                  <AddMoneyBlock
                    money={result.score * 10}
                    variant="h4"
                    width={25}
                  />
                </Grid>
                <Grid
                  size={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <EmojiEventsIcon fontSize="large" />
                  <Box sx={{ flex: 1 }}>
                    <Box>
                      <Typography variant="body1" component="span">
                        {`${t("commun.score")} : `}
                      </Typography>
                      <Typography variant="h4" component="span">
                        {`${result.score} / ${total}`}
                      </Typography>
                    </Box>
                    {data.previouslistscore && (
                      <Box>
                        <Typography variant="body1" component="span">
                          {`${t("commun.record")} : `}
                        </Typography>
                        <Typography variant="h4" component="span">
                          {`${data.previouslistscore.result} / ${total}`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {data.previouslistscore && (
                    <Box>
                      <ChangeNumberBlock
                        value={result.score}
                        previous={data.previouslistscore.result}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid
                  size={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <QuestionMarkIcon fontSize="large" />
                  <Box sx={{ flex: 1 }}>
                    <Box>
                      <Typography variant="body1" component="span">
                        {`${t("commun.score")} : `}
                      </Typography>
                      <Typography variant="h4" component="span">
                        <Trans
                          i18nKey={t("commun.attempt")}
                          values={{
                            count: result.attempts,
                          }}
                        />
                      </Typography>
                    </Box>
                    {data.previouslistscore && (
                      <Box>
                        <Typography variant="body1" component="span">
                          {`${t("commun.record")} : `}
                        </Typography>
                        <Typography variant="h4" component="span">
                          <Trans
                            i18nKey={t("commun.attempt")}
                            values={{
                              count:
                                data.previouslistscore.attempts_recordattempts,
                            }}
                          />
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {data.previouslistscore && (
                    <Box>
                      <ChangeNumberBlock
                        value={result.attempts}
                        previous={
                          data.previouslistscore.attempts_recordattempts
                        }
                        order={Order.DESC}
                      />
                    </Box>
                  )}
                </Grid>
                <Grid
                  size={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <AccessTimeIcon fontSize="large" />
                  <Box sx={{ flex: 1 }}>
                    <Box>
                      <Typography variant="body1" component="span">
                        {`${t("commun.score")} : `}
                      </Typography>
                      <Typography variant="h4" component="span">
                        {`${(result.time / 1000).toFixed(2)}s`}
                      </Typography>
                    </Box>
                    {data.previouslistscore && (
                      <Box>
                        <Typography variant="body1" component="span">
                          {`${t("commun.record")} : `}
                        </Typography>
                        <Typography variant="h4" component="span">
                          {`${(data.previouslistscore.time_recordtime / 1000).toFixed(2)}s`}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  {data.previouslistscore && (
                    <Box>
                      <ChangeNumberBlock
                        value={Number((result.time / 1000).toFixed(2))}
                        previous={Number(
                          (
                            data.previouslistscore.time_recordtime / 1000
                          ).toFixed(2),
                        )}
                        unit={"s"}
                        order={Order.DESC}
                      />
                    </Box>
                  )}
                </Grid>
              </>
            )}
            <Grid size={6}>
              <ButtonColor
                value={Colors.colorApp}
                label={t("commun.tryagain")}
                icon={ReplayIcon}
                variant="contained"
                onClick={retry}
              />
            </Grid>
            <Grid size={6}>
              <ButtonColor
                value={Colors.red}
                label={t("commun.leave")}
                icon={CancelIcon}
                variant="contained"
                onClick={handleClose}
              />
            </Grid>
          </Grid>
        )}
      </Box>
    </Dialog>
  );
};
