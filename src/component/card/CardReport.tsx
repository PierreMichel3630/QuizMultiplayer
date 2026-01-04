import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent } from "csx";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { Report } from "src/models/Report";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "../Button";
import { CardSignalQuestion } from "./CardQuestion";
import moment from "moment";
import { ImageThemeBlock } from "../ImageThemeBlock";
import { TextNameBlock } from "../language/TextLanguageBlock";

interface Props {
  report: Report;
  onDelete: () => void;
}

export const CardReport = ({ report, onDelete }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <Paper
      sx={{ p: 1, height: percent(100), position: "relative" }}
      variant="outlined"
    >
      <Grid container spacing={1} justifyContent="center">
        <Grid sx={{ textAlign: "center" }} size={12}>
          <Typography variant="h4" component="span">
            {`${t("commun.signal")}  ${moment(report.created_at).format(
              "DD/MM/YYYY à HH:mm"
            )}`}
          </Typography>
          {report.profile && (
            <Grid sx={{ textAlign: "center" }} size={12}>
              <Link to={`/profile/${report.profile.id}`}>
                <Typography variant="h6" component="span">
                  {`${t("commun.per")} ${report.profile.username}`}
                </Typography>
              </Link>
            </Grid>
          )}
        </Grid>
        <Grid size={12}>
          <Typography variant="h6" component="span">{`${t(
            "commun.typeproblem"
          )} : `}</Typography>
          <JsonLanguageBlock value={report.message.message} component="span" />
        </Grid>
        <Grid size={12}>
          <Typography variant="h6" component="span">{`${t(
            "commun.descriptionerror"
          )} : `}</Typography>
          <Typography variant="body1" component="span">
            {report.description}
          </Typography>
        </Grid>
        <Grid size={12}>
          {(report.duelgame || report.sologame) && (
            <Box
              sx={{
                backgroundColor: Colors.black,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  alignItems: "center",
                  p: 1,
                }}
              >
                <ImageThemeBlock
                  theme={
                    report.duelgame
                      ? report.duelgame.themequestion
                      : report.sologame!.themequestion
                  }
                  size={60}
                />
                <TextNameBlock
                  color="text.secondary"
                  variant="h4"
                  values={
                    report.duelgame
                      ? report.duelgame.themequestion.themetranslation
                      : report.sologame!.themequestion.themetranslation
                  }
                />
              </Box>
            </Box>
          )}
          {report.questionjson && (
            <Box
              sx={{
                backgroundColor: Colors.black,
              }}
            >
              <CardSignalQuestion
                question={report.questionjson}
                version={report.version}
              />
            </Box>
          )}
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4
          }}>
          {(report.duelgame || report.sologame) && (
            <ButtonColor
              value={Colors.purple}
              label={t("commun.seegame")}
              icon={VisibilityIcon}
              variant="contained"
              onClick={() =>
                navigate(
                  report.sologame
                    ? `/game/solo/${report.sologame.uuid}`
                    : `/game/duel/${report.duelgame!.uuid}`
                )
              }
            />
          )}
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4
          }}>
          {report.question && (
            <ButtonColor
              value={Colors.blue}
              label={t("commun.seequestion")}
              icon={VisibilityIcon}
              variant="contained"
              onClick={() =>
                navigate(
                  `/administration/edit/questions?ids=${report.question?.id}`
                )
              }
            />
          )}
        </Grid>
        <Grid
          size={{
            xs: 12,
            sm: 4
          }}>
          <ButtonColor
            value={Colors.red}
            label={t("commun.delete")}
            icon={DeleteIcon}
            variant="contained"
            onClick={onDelete}
          />
        </Grid>
      </Grid>
    </Paper>
  );
};
