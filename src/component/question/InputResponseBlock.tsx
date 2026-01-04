import {
  Box,
  FormControl,
  Grid,
  InputBase,
  Paper,
  Typography,
} from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { useTranslation } from "react-i18next";
import { searchAnswerByLanguageAndSet } from "src/api/answer";
import { useUser } from "src/context/UserProvider";
import { AnswerTranslation } from "src/models/Answer";
import { Colors } from "src/style/Colors";
import { AnswerUser } from "./ResponseBlock";

interface Props {
  onSubmit: (value: AnswerUser) => void;
  answerset?: number;
}
export const InputResponseBlock = ({ onSubmit, answerset }: Props) => {
  const { t } = useTranslation();
  const { uuid, language } = useUser();

  const [value, setValue] = useState("");
  const [responses, setResponses] = useState<Array<string>>([]);

  useEffect(() => {
    setResponses([]);
    const timer = setTimeout(() => {
      if (answerset && value.length >= 3 && language) {
        searchAnswerByLanguageAndSet(answerset, language, value).then(
          ({ data }) => {
            const res: Array<AnswerTranslation> = data ?? [];
            setResponses(res.map((el) => el.label));
          }
        );
      } else {
        setResponses([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [value, answerset, language]);

  return (
    <Box sx={{ width: percent(100), position: "relative" }}>
      {responses.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            width: percent(100),
            backgroundColor: Colors.black,
            bottom: px(62),
            border: "1px solid white",
          }}
        >
          {responses.map((response, index) => (
            <Box
              sx={{
                backgroundColor: Colors.grey,
                textAlign: "center",
                p: 1,
                cursor: "pointer",
                border: "1px solid white",
              }}
              key={index}
              onClick={() => {
                setValue(response);
                onSubmit({
                  uuid: uuid,
                  value: response,
                });
              }}
            >
              <Typography variant="h2" color="text.secondary">
                {response}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
      <Paper
        sx={{
          p: 0.5,
          display: "flex",
          width: percent(100),
          backgroundColor: Colors.grey,
        }}
        variant="outlined"
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item xs>
            <form
              noValidate
              autoComplete="off"
              onSubmit={(event) => {
                event.preventDefault();
                onSubmit({
                  uuid: uuid,
                  value: value,
                });
                setValue("");
              }}
            >
              <FormControl fullWidth>
                <InputBase
                  fullWidth
                  autoFocus={!isMobile}
                  value={value}
                  placeholder={t("commun.devine")}
                  onChange={(event) => setValue(event.target.value)}
                  inputProps={{
                    style: {
                      textAlign: "center",
                      fontFamily: ["Montserrat", "sans-serif"].join(","),
                      fontSize: 20,
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
                />
              </FormControl>
            </form>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
