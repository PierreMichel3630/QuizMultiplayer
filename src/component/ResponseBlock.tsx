import { Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useUser } from "src/context/UserProvider";
import {
  Response,
  ResponseDuel,
  ResponseLanguage,
  ResponseSolo,
} from "src/models/Response";
import { Colors } from "src/style/Colors";
import { sortByTime } from "src/utils/sort";

import { useTranslation } from "react-i18next";
import rank1 from "src/assets/rank/rank1.png";
import rank2 from "src/assets/rank/rank2.png";
import rank3 from "src/assets/rank/rank3.png";
import { style } from "typestyle";
import { InputResponseBlock } from "./InputResponseBlock";
import { JsonLanguageArrayOrStringBlock } from "./JsonLanguageBlock";

import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";

const imageCss = style({
  width: px(40),
  height: px(40),
});

interface Props {
  response: Response;
}

const InfoPosition: { [key: number]: { color: string; icon: string } } = {
  1: { color: Colors.gold, icon: rank1 },
  2: { color: Colors.silver, icon: rank2 },
  3: { color: Colors.bronze, icon: rank3 },
};

export const ResponsePlayerBlock = ({ response }: Props) => {
  return (
    <Grid container spacing={1}>
      {response.players.sort(sortByTime).map((player, index) => {
        const info = InfoPosition[index + 1];
        return (
          <Grid item xs={12} key={player.uuid}>
            <Paper
              sx={{
                p: 1,
                backgroundColor: info.color,
                borderRadius: px(10),
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                width: percent(100),
              }}
            >
              <img src={info.icon} className={imageCss} />
              <Typography variant="h2" sx={{ color: "white" }}>
                {player.username}
              </Typography>
              <Typography variant="h4" sx={{ color: "white" }}>
                {(player.time / 1000).toFixed(2)}s
              </Typography>
            </Paper>
          </Grid>
        );
      })}
      <Grid item xs={12}>
        <ResponseBlock response={response.response} />
      </Grid>
    </Grid>
  );
};

interface ResponseProps {
  response: ResponseLanguage;
}

export const ResponseBlock = ({ response }: ResponseProps) => {
  const { language } = useUser();
  const value = response[language.iso]
    ? response[language.iso]
    : response["fr-FR"];

  const label = Array.isArray(value) ? value[0] ?? "" : value;

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: Colors.green,
        borderRadius: px(10),
        textAlign: "center",
        width: percent(100),
      }}
    >
      <Typography variant="h2" sx={{ color: "white" }}>
        {label}
      </Typography>
    </Paper>
  );
};

interface ResponseSoloProps {
  response: ResponseSolo;
}

export const ResponseSoloBlock = ({ response }: ResponseSoloProps) => {
  const { t } = useTranslation();
  const { language } = useUser();
  const value = response.response[language.iso]
    ? response.response[language.iso]
    : response.response["fr-FR"];

  const label = Array.isArray(value) ? value[0] ?? "" : value;

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: response.result ? Colors.green : Colors.red,
        borderRadius: px(5),
        textAlign: "center",
        width: percent(100),
      }}
    >
      <Typography variant="h2" color="text.secondary">
        {response.answer}
      </Typography>
      <Typography variant="h4" color="text.secondary" component="span">
        {t("commun.goodresponse")} :{" "}
      </Typography>
      <Typography variant="h2" color="text.secondary" component="span">
        {label}
      </Typography>
    </Paper>
  );
};

interface ResponseDuelProps {
  response?: Response;
  responsePlayer1?: ResponseDuel;
  responsePlayer2?: ResponseDuel;
  onSubmit: (value: string) => void;
}

export const ResponseDuelBlock = ({
  response,
  responsePlayer1,
  responsePlayer2,
  onSubmit,
}: ResponseDuelProps) => {
  const { uuid } = useUser();

  const isPlayer1 = responsePlayer1 && uuid === responsePlayer1.uuid;
  const isPlayer2 = responsePlayer2 && uuid === responsePlayer2.uuid;
  const hasAnswer =
    response ||
    (responsePlayer1 && responsePlayer1.uuid === uuid) ||
    (responsePlayer2 && responsePlayer2.uuid === uuid);

  return (
    <>
      {!hasAnswer ? (
        <InputResponseBlock onSubmit={onSubmit} />
      ) : (
        <>
          {response && (
            <Paper
              sx={{
                p: 1,
                backgroundColor: Colors.green,
                borderRadius: px(10),
                textAlign: "center",
                width: percent(100),
              }}
            >
              <JsonLanguageArrayOrStringBlock
                variant="h2"
                color="text.secondary"
                value={response.response}
              />
            </Paper>
          )}
          {responsePlayer1 && (response || isPlayer1) && (
            <Paper
              sx={{
                p: 1,
                backgroundColor: responsePlayer1.result
                  ? Colors.green
                  : Colors.red,
                borderRadius: px(10),
                textAlign: "center",
                width: percent(100),
                position: "relative",
              }}
            >
              <ArrowRightIcon
                sx={{
                  fontSize: 50,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  left: 0,
                  color: Colors.white,
                }}
              />
              <Typography variant="h2" color="text.secondary">
                {responsePlayer1.answer}
              </Typography>
            </Paper>
          )}
          {responsePlayer2 && (response || isPlayer2) && (
            <Paper
              sx={{
                p: 1,
                backgroundColor: responsePlayer2.result
                  ? Colors.green
                  : Colors.red,
                borderRadius: px(10),
                textAlign: "center",
                width: percent(100),
                position: "relative",
                color: Colors.white,
              }}
            >
              <Typography variant="h2" color="text.secondary">
                {responsePlayer2.answer}
              </Typography>
              <ArrowLeftIcon
                sx={{
                  fontSize: 50,
                  position: "absolute",
                  top: percent(50),
                  translate: "0 -50%",
                  right: 0,
                }}
              />
            </Paper>
          )}
        </>
      )}
    </>
  );
};
