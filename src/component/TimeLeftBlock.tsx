import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { Box, Typography } from "@mui/material";
import { important, padding, percent, px } from "csx";
import moment from "moment";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useUser } from "src/context/UserProvider";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "./Button";

import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";

interface Props {
  intervalHours: number;
  lastDate?: Date;
  onLaunch: () => void;
}

export const TimeLeftBlock = ({ intervalHours, lastDate, onLaunch }: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { mode } = useUser();
  const DELAY = 1000;
  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const [diffSeconds, setDiffSeconds] = useState(0);
  const [disabled, setDisabled] = useState(false);

  const diffSecondsDefault = useMemo(
    () => (lastDate ? moment().diff(moment(lastDate), "seconds") : 0),
    [lastDate]
  );

  const isDisplay = useMemo(
    () => (lastDate ? diffSeconds > 0 : false),
    [lastDate, diffSeconds]
  );

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
        <ButtonColor
          value={Colors.red3}
          label={t("commun.launch")}
          variant="contained"
          onClick={() => {
            if (!disabled) {
              setDisabled(true);
              onLaunch();
            }
          }}
          sx={{
            borderRadius: percent(50),
            width: px(100),
            height: px(100),
            background: Colors.red3,
          }}
        />
      )}
    </>
  );
};

interface PropsTimeLeftLabel {
  intervalHours: number;
  lastDate?: Date;
  size?: "large" | "medium" | "small";
}

export const TimeLeftLabel = ({
  intervalHours,
  lastDate,
  size = "medium",
}: PropsTimeLeftLabel) => {
  const { mode } = useUser();
  const DELAY = 1000;
  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const [diffSeconds, setDiffSeconds] = useState(0);

  const diffSecondsDefault = useMemo(
    () => (lastDate ? moment().diff(moment(lastDate), "seconds") : 0),
    [lastDate]
  );

  const isDisplay = useMemo(
    () => (lastDate ? diffSeconds > 0 : false),
    [lastDate, diffSeconds]
  );

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

  const fontSize = useMemo(() => {
    let font = 15;
    if (size === "small") {
      font = 10;
    } else if (size === "large") {
      font = 20;
    }
    return font;
  }, [size]);

  return (
    isDisplay && (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          alignContent: "center",
          justifyContent: "center",
          gap: px(2),
          borderRadius: px(50),
          p: padding(2, 5),
          border: `2px solid ${isDarkMode ? Colors.white : Colors.black}`,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          color: Colors.white,
        }}
      >
        <AccessTimeIcon fontSize={size} />
        <Typography
          variant="body1"
          sx={{
            fontSize: important(px(fontSize)),
            fontWeight: important(700),
          }}
        >
          {hours}:{minutes}:{seconds}
        </Typography>
      </Box>
    )
  );
};
