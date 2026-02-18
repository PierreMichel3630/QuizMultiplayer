import { Box, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import moment from "moment";
import { useMemo } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import {
  ListAnswer,
  ListAnswerPlay,
  ListTranslation,
  TypeList,
} from "src/models/List";
import { Colors } from "src/style/Colors";
import { ImageCard } from "../image/ImageCard";

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
  type?: TypeList;
}

export const CardAnswerList = ({
  value,
  type,
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
        {value.image && (
          <Box sx={{ maxWidth: px(70), maxHeight: px(70) }}>
            <img
              src={value.image}
              data-src={value.image}
              loading="lazy"
              style={{
                maxHeight: percent(100),
                maxWidth: percent(100),
                objectFit: "contain",
                backgroundColor: Colors.grey2,
                outline: "2px solid black",
              }}
            />
          </Box>
        )}
        <Typography
          variant="h2"
          sx={{
            color: value.hasAnswer ? Colors.correctanswer : Colors.wronganswer,
          }}
        >
          {value.hasAnswer || showAnswer ? answer.name : ""}
        </Typography>
        <ValueAnswerList value={value} type={type} />
      </Paper>
    )
  );
};

interface PropsValueAnswerList {
  value: ListAnswer;
  type?: TypeList;
}

export const ValueAnswerList = ({ value, type }: PropsValueAnswerList) => {
  const label = useMemo(() => {
    let result = undefined;
    if (type === TypeList.DATE) {
      result = moment(value.value).toLocaleString();
    } else if (type === TypeList.NUMBER) {
      result = Number(value.value).toLocaleString();
    }
    return result;
  }, [type, value.value]);

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
