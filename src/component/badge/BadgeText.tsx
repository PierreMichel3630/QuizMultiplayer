import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Status } from "src/models/enum/Status";
import { Colors } from "src/style/Colors";

import { padding, px } from "csx";
import { useMemo } from "react";
import { ListScore } from "src/models/List";

interface Props {
  color: string;
  icon?: JSX.Element;
  text: string;
}

export const BadgeText = ({ color, icon, text }: Props) => (
  <Box
    sx={{
      padding: padding(0, 5),
      gap: px(2),
      borderRadius: px(5),
      backgroundColor: color,
      width: "fit-content",
      display: "flex",
      alignItems: "center",
    }}
  >
    {icon && <Box sx={{ display: "flex" }}>{icon}</Box>}
    <Typography variant="body1">{text}</Typography>
  </Box>
);

interface PropsStatus {
  score?: ListScore;
}

export const BadgeStatusList = ({ score }: PropsStatus) => {
  const { t } = useTranslation();

  const status = useMemo(() => {
    let result: Status | undefined = undefined;

    if (score) {
      if (score.result >= score.list.elements) {
        result = Status.FINISH;
      } else {
        result = Status.PLAY;
      }
    } else {
      result = Status.NOTPLAY;
    }
    return result;
  }, [score]);

  return (
    <>
      {
        {
          FINISH: (
            <BadgeText color={Colors.green} text={t(`enum.status.${status}`)} />
          ),
          PLAY: (
            <BadgeText
              color={Colors.orange3}
              text={t(`enum.status.${status}`)}
            />
          ),
          NOTPLAY: (
            <BadgeText color={Colors.red} text={t(`enum.status.${status}`)} />
          ),
        }[status]
      }
    </>
  );
};
