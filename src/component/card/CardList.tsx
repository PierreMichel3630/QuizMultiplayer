import { Box, Paper, Typography } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import {
  ListAnswerPlay,
  ListAnswerTranslation,
  ListTranslation,
  ListType,
} from "src/models/List";
import { ImageCard } from "../image/ImageCard";
import { Colors } from "src/style/Colors";

interface Props {
  value: ListTranslation;
}

export const CardList = ({ value }: Props) => {
  const { t } = useTranslation();

  const image = useMemo(
    () => ({
      image: undefined,
      color: undefined,
    }),
    [],
  );

  return (
    <Link to={`/list/${value.list.id}`} style={{ textDecoration: "none" }}>
      <Paper
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
        elevation={8}
      >
        <ImageCard value={image} size={40} />
        <Box>
          <Typography variant="h4">{value.name}</Typography>
          <Typography>
            <Trans
              i18nKey={t("commun.item")}
              values={{
                count: value.elements,
              }}
            />
          </Typography>
        </Box>
      </Paper>
    </Link>
  );
};

interface PropsCardAnswerList {
  value: ListAnswerPlay;
  showAnswer?: boolean;
}

export const CardAnswerList = ({
  value,
  showAnswer = false,
}: PropsCardAnswerList) => {
  const { language } = useUser();

  const answer = useMemo(() => {
    let result = undefined;
    if (language) {
      const translation = [...value.listanswertranslation].find(
        (el) => el.language.id === language.id,
      );
      result = translation ?? [...value.listanswertranslation][0];
    }
    return result;
  }, [language, value]);

  return (
    answer && (
      <Paper
        sx={{
          p: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
        }}
        elevation={8}
      >
        <Typography
          variant="h2"
          sx={{
            color: value.hasAnswer ? Colors.correctanswer : Colors.wronganswer,
          }}
        >
          {value.hasAnswer || showAnswer ? answer.name : ""}
        </Typography>
        <ValueAnswerList value={answer} />
      </Paper>
    )
  );
};

interface PropsValueAnswerList {
  value: ListAnswerTranslation;
}

export const ValueAnswerList = ({ value }: PropsValueAnswerList) => {
  const label = useMemo(() => {
    let result = undefined;
    if (value.type === ListType.DATE) {
      result = moment(value.value).toLocaleString();
    } else if (value.type === ListType.NUMBER) {
      result = Number(value.value).toLocaleString();
    }
    return result;
  }, [value]);

  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        justifyContent: "center",
        alignItems: "baseline",
      }}
    >
      <Typography variant="h4" component="span">
        {label}
      </Typography>
      {value.unit && (
        <Typography variant="h4" component="span">
          {value.unit}
        </Typography>
      )}
    </Box>
  );
};
