import { FormControl, Grid, InputBase, Paper } from "@mui/material";
import { px } from "csx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { HealthBlock } from "./HealthBlock";
import { Timer } from "./Timer";

interface Props {
  onSubmit: (value: string) => void;
  health?: number;
  timer?: number;
}
export const InputResponseBlock = ({ onSubmit, health, timer }: Props) => {
  const { t } = useTranslation();

  const [value, setValue] = useState("");

  return (
    <Paper sx={{ p: 0.5, display: "flex" }}>
      <Grid container spacing={1} alignItems="center">
        <Grid item xs>
          <form
            noValidate
            autoComplete="off"
            onSubmit={(event) => {
              event.preventDefault();
              onSubmit(value);
              setValue("");
            }}
          >
            <FormControl fullWidth>
              <InputBase
                fullWidth
                value={value}
                placeholder={t("commun.devine")}
                onChange={(event) => setValue(event.target.value)}
                inputProps={{
                  style: {
                    textAlign: "center",
                    fontFamily: ["Montserrat", "sans-serif"].join(","),
                    fontSize: 25,
                    fontWeight: 700,
                  },
                }}
                sx={{
                  border: `3px solid ${Colors.purple}`,
                  backgroundColor: Colors.white,
                  height: px(50),
                  borderRadius: px(15),
                  textAlign: "center",
                }}
                autoFocus
              />
            </FormControl>
          </form>
        </Grid>
        {timer && (
          <Grid item>
            <Timer time={timer} size={45} thickness={6} fontSize={15} />
          </Grid>
        )}
        {health !== undefined && (
          <Grid item>
            <HealthBlock health={health} />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
