import { Box, Button, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useUser } from "src/context/UserProvider";
import { padding, percent, px } from "csx";
import { Colors } from "src/style/Colors";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ButtonColor } from "./Button";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

interface Props {
  intervalHours: number;
  lastDate: Date;
  onLaunch: () => void;
}

export const TimeLeftBlock = ({ intervalHours, lastDate, onLaunch }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mode } = useUser();
  const DELAY = 1000;
  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const [diffSeconds, setDiffSeconds] = useState(0);

  const diffSecondsDefault = useMemo(
    () => moment().diff(moment(lastDate), "seconds"),
    [intervalHours, lastDate]
  );

  const isDisplay = useMemo(() => diffSeconds > 0, [diffSeconds]);

  const hours = useMemo(() => {
    const result = Math.floor(diffSeconds / 3600);
    return result < 10 ? `0${result}` : result;
  }, [diffSeconds]);
  const minutes = useMemo(() => {
    const result = Math.floor((diffSeconds % 3600) / 60);
    return result < 10 ? `0${result}` : result;
  }, [diffSeconds]);
  const seconds = useMemo(() => {
    const result = diffSeconds % 60;
    return result < 10 ? `0${result}` : result;
  }, [diffSeconds]);

  useEffect(() => {
    const secondsIntervalHours = intervalHours * 3600;
    setDiffSeconds(secondsIntervalHours - diffSecondsDefault);
    const interval = setInterval(() => {
      setDiffSeconds((prev) => prev - 1);
    }, DELAY);
    return () => clearInterval(interval);
  }, [diffSecondsDefault, intervalHours]);

  return (
    <>
      {isDisplay ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: px(5),
              flexDirection: "column",
              textAlign: "center",
            }}
          >
            <Typography variant="h4">{t("commun.nextlaunch")}</Typography>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                alignContent: "center",
                justifyContent: "center",
                gap: 1,
                minWidth: px(140),
                borderRadius: px(50),
                p: padding(3, 15),
                border: `2px solid ${isDarkMode ? Colors.white : Colors.black}`,
              }}
            >
              <AccessTimeIcon />
              <Typography variant="h4">
                {hours}:{minutes}:{seconds}
              </Typography>
            </Box>
          </Box>
          <ButtonColor
            fullWidth
            value={Colors.blue2}
            label={t("commun.return")}
            icon={KeyboardReturnIcon}
            variant="contained"
            onClick={() => {
              navigate(-1);
            }}
          />
        </>
      ) : (
        <Button
          variant="outlined"
          sx={{
            borderRadius: percent(50),
            width: px(100),
            height: px(100),
            background: Colors.red3,
          }}
          onClick={onLaunch}
        >
          <Typography variant="h4" noWrap>
            {t("commun.launch")}
          </Typography>
        </Button>
      )}
    </>
  );
};
