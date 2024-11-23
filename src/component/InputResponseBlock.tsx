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
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { HealthBlock } from "./HealthBlock";
import { isMobile } from "react-device-detect";
import { searchResponseByTypeAndValue } from "src/api/response";
import { MyResponse, ResponseUpdate } from "src/models/Response";
import { useUser } from "src/context/UserProvider";

interface Props {
  onSubmit: (value: MyResponse) => void;
  health?: number;
  typeResponse?: string;
  myresponse: string | number | undefined;
}
export const InputResponseBlock = ({
  onSubmit,
  health,
  typeResponse,
  myresponse,
}: Props) => {
  const { t } = useTranslation();
  const { language } = useUser();

  const [value, setValue] = useState("");
  const [responses, setResponses] = useState<Array<string>>([]);

  useEffect(() => {
    setResponses([]);
    const timer = setTimeout(() => {
      if (typeResponse && value.length >= 3 && myresponse === undefined) {
        searchResponseByTypeAndValue(value, typeResponse).then(({ data }) => {
          const res = data as Array<ResponseUpdate>;
          const arrayString = res.map((el) => el.value[language.iso]);
          setResponses(arrayString);
        });
      } else {
        setResponses([]);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [value, typeResponse, language, myresponse]);

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
                  value: response,
                  exact: true,
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
        {myresponse ? (
          <Box
            sx={{
              border: `1px solid ${Colors.white}`,
              backgroundColor: Colors.grey4,
              height: px(50),
              borderRadius: px(15),
              textAlign: "center",
              color: Colors.white,
              width: percent(100),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography variant="h2">{myresponse}</Typography>
          </Box>
        ) : (
          <Grid container spacing={1} alignItems="center">
            <Grid item xs>
              <form
                noValidate
                autoComplete="off"
                onSubmit={(event) => {
                  event.preventDefault();
                  onSubmit({
                    value: value,
                    exact: false,
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
                        color: Colors.white,
                      },
                    }}
                    sx={{
                      border: `1px solid ${Colors.white}`,
                      backgroundColor: Colors.grey,
                      height: px(50),
                      borderRadius: px(15),
                      textAlign: "center",
                      color: Colors.white,
                    }}
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
        )}
      </Paper>
    </Box>
  );
};
