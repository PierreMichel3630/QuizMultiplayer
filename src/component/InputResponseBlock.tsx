import { FormControl, InputBase, Paper } from "@mui/material";
import { px } from "csx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";

interface Props {
  onSubmit: (value: string) => void;
}
export const InputResponseBlock = ({ onSubmit }: Props) => {
  const { t } = useTranslation();

  const [value, setValue] = useState("");

  return (
    <Paper sx={{ p: 1 }}>
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
          />
        </FormControl>
      </form>
    </Paper>
  );
};
