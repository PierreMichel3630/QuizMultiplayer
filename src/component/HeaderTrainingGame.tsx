import { Typography } from "@mui/material";
import { useMemo } from "react";

import { Theme } from "src/models/Theme";
import { ScoreThemeBlock } from "./ScoreThemeBlock";

interface Props {
  goodAnswer: number;
  badAnswer: number;
  theme?: Theme;
}

export const HeaderTrainingGame = ({ theme, goodAnswer, badAnswer }: Props) => {
  const numberQuestions = useMemo(
    () => goodAnswer + badAnswer,
    [goodAnswer, badAnswer]
  );

  return (
    theme && (
      <ScoreThemeBlock
        theme={theme}
        extra={
          numberQuestions > 0 ? (
            <>
              <Typography variant="h2" color="text.secondary">
                {goodAnswer} / {numberQuestions}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                ({((goodAnswer / numberQuestions) * 100).toFixed(0)} %)
              </Typography>
            </>
          ) : undefined
        }
      />
    )
  );
};
