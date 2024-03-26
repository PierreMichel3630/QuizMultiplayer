import { FormControl, Grid, InputBase, Paper } from "@mui/material";
import { percent, px } from "csx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { HealthBlock } from "./HealthBlock";

interface Props {
  onSubmit: (value: string) => void;
  health?: number;
}
export const InputResponseBlock = ({ onSubmit, health }: Props) => {
  const { t } = useTranslation();

  const [value, setValue] = useState("");

  return (
    <Paper sx={{ p: 0.5, display: "flex", width: percent(100) }}>
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
                    fontSize: 15,
                    fontWeight: 700,
                  },
                }}
                sx={{
                  border: `1px solid ${Colors.white}`,
                  backgroundColor: Colors.grey,
                  height: px(50),
                  borderRadius: px(15),
                  textAlign: "center",
                }}
                autoFocus
              />
            </FormControl>
          </form>
        </Grid>
        {health !== undefined && (
          <Grid item>
            <HealthBlock health={health} />
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};
