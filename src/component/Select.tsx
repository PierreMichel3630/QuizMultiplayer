import { Box, Grid, Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Difficulty, colorDifficulty } from "src/models/enum";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

interface Props {
  value: Difficulty;
  onSelect: (value: Difficulty) => void;
}

export const SelectDifficulty = ({ value, onSelect }: Props) => {
  const { t } = useTranslation();
  const [focused, setFocused] = useState(false);

  const onFocus = () => setFocused((prev) => !prev);
  const unFocus = () => setFocused(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        unFocus();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <Box style={{ position: "relative" }} ref={ref}>
      <Box
        sx={{
          p: "2px 10px",
          display: "flex",
          alignItems: "center",
          width: percent(100),
          cursor: "pointer",
          justifyContent: "space-between",
          gap: 1,
          backgroundColor: colorDifficulty[value],
          borderRadius: 2,
        }}
        onClick={onFocus}
      >
        <Box>
          <Typography variant="h4" sx={{ color: "white" }}>
            {t(`enum.difficulty.${value}`)}
          </Typography>
        </Box>
        <ArrowDropDownIcon sx={{ color: "white" }} />
      </Box>
      {focused && (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            width: percent(100),
            zIndex: 2,
            flexDirection: "column",
            position: "absolute",
            maxHeight: px(200),
            mt: 1,
            overflow: "scroll",
            overflowY: "inherit",
          }}
        >
          {Object.keys(Difficulty).map((el) => (
            <Grid
              container
              sx={{
                cursor: "pointer",
                color: colorDifficulty[el],
                p: 1,
                "&:hover": {
                  color: "white",
                  backgroundColor: colorDifficulty[el],
                },
              }}
              alignItems="center"
              onClick={() => {
                onSelect(el as Difficulty);
                unFocus();
              }}
              key={el}
            >
              <Grid item xs={12}>
                <Typography variant="h4">
                  {t(`enum.difficulty.${el}`)}
                </Typography>
              </Grid>
            </Grid>
          ))}
        </Paper>
      )}
    </Box>
  );
};
