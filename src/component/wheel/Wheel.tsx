import { useEffect, useRef, useState } from "react";

import { Box, styled } from "@mui/material";
import { percent, px, viewWidth } from "csx";
import { TypeWheelEnum } from "src/models/enum/TypeWheelEnum";
import { Colors } from "src/style/Colors";
import { WheelData } from "./types";
import { getRotationDegrees } from "./utils";
import { WheelCanvas } from "./WheelCanvas";

import { Triangle } from "../svg/Triangle";

interface Props {
  darkMode: boolean;
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: Array<WheelData>;
  onStopSpinning?: () => any;
  spinDuration?: number;
}

const STARTED_SPINNING = "started-spinning";

const START_SPINNING_TIME = 2600;
const CONTINUE_SPINNING_TIME = 750;
const STOP_SPINNING_TIME = 8000;

export const Wheel = ({
  darkMode,
  mustStartSpinning,
  prizeNumber,
  data,
  onStopSpinning = () => null,
  spinDuration = 1.0,
}: Props): JSX.Element | null => {
  const srcXp = "https://quizbattle.fr/xp.svg";
  const srcGold = "https://quizbattle.fr/money.svg";

  const [wheelData, setWheelData] = useState<WheelData[]>([...data]);
  const [startRotationDegrees, setStartRotationDegrees] = useState(0);
  const [finalRotationDegrees, setFinalRotationDegrees] = useState(0);
  const [hasStartedSpinning, setHasStartedSpinning] = useState(false);
  const [hasStoppedSpinning, setHasStoppedSpinning] = useState(false);
  const [isCurrentlySpinning, setIsCurrentlySpinning] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState(false);
  const [rouletteUpdater, setRouletteUpdater] = useState(false);
  const [loadedImagesCounter, setLoadedImagesCounter] = useState(0);
  const [totalImages, setTotalImages] = useState(0);
  const mustStopSpinning = useRef<boolean>(false);

  const normalizedSpinDuration = Math.max(0.01, spinDuration);

  const startSpinningTime = START_SPINNING_TIME * normalizedSpinDuration;
  const continueSpinningTime = CONTINUE_SPINNING_TIME * normalizedSpinDuration;
  const stopSpinningTime = STOP_SPINNING_TIME * normalizedSpinDuration;

  const totalSpinningTime =
    startSpinningTime + continueSpinningTime + stopSpinningTime;

  useEffect(() => {
    const dataLength = data?.length || 0;
    const wheelDataAux = [] as WheelData[];

    for (let i = 0; i < dataLength; i++) {
      wheelDataAux[i] = {
        ...data[i],
      };
      setTotalImages((prevCounter) => prevCounter + 1);

      const img = new Image();
      img.src = data[i].type === TypeWheelEnum.GOLD ? srcGold : srcXp;
      img.onload = () => {
        wheelDataAux[i].image = {
          uri: img.src,
          offsetX: 0,
          offsetY: 0,
          landscape: false,
          sizeMultiplier: 1,
          _imageHTML: img,
        };
        setLoadedImagesCounter((prevCounter) => prevCounter + 1);
        setRouletteUpdater((prevState) => !prevState);
      };
    }

    setWheelData([...wheelDataAux]);
    setIsDataUpdated(true);
  }, [data]);

  useEffect(() => {
    if (mustStartSpinning && !isCurrentlySpinning) {
      setIsCurrentlySpinning(true);
      startSpinning();
      const finalRotationDegreesCalculated = getRotationDegrees(
        prizeNumber,
        data.length
      );
      setFinalRotationDegrees(finalRotationDegreesCalculated);
    }
  }, [mustStartSpinning]);

  useEffect(() => {
    if (hasStoppedSpinning) {
      setIsCurrentlySpinning(false);
      setStartRotationDegrees(finalRotationDegrees);
    }
  }, [hasStoppedSpinning]);

  const startSpinning = () => {
    setHasStartedSpinning(true);
    setHasStoppedSpinning(false);
    mustStopSpinning.current = true;
    setTimeout(() => {
      if (mustStopSpinning.current) {
        mustStopSpinning.current = false;
        setHasStartedSpinning(false);
        setHasStoppedSpinning(true);
        onStopSpinning();
      }
    }, totalSpinningTime);
  };

  const getRouletteClass = () => {
    if (hasStartedSpinning) {
      return STARTED_SPINNING;
    }
    return "";
  };

  if (!isDataUpdated) {
    return null;
  }

  return (
    <Box
      sx={{
        position: "relative",
        width: viewWidth(90),
        maxWidth: px(445),
        height: viewWidth(90),
        maxHeight: px(445),
        objectFit: "contain",
        flexShrink: 0,
        zIndex: 5,
        pointerEvents: "none",
        visibility:
          totalImages > 0 && loadedImagesCounter !== totalImages
            ? "hidden"
            : "initial",
      }}
    >
      <RotationContainer
        className={getRouletteClass()}
        startSpinningTime={startSpinningTime}
        continueSpinningTime={continueSpinningTime}
        stopSpinningTime={stopSpinningTime}
        startRotationDegrees={startRotationDegrees}
        finalRotationDegrees={finalRotationDegrees}
      >
        <WheelCanvas
          width="900"
          height="900"
          data={wheelData}
          outerBorderColor={darkMode ? Colors.white : Colors.black}
          outerBorderWidth={8}
          innerRadius={0}
          innerBorderColor={darkMode ? Colors.white : Colors.black}
          innerBorderWidth={0}
          radiusLineColor={darkMode ? Colors.white : Colors.black}
          radiusLineWidth={5}
          perpendicularText={false}
          rouletteUpdater={rouletteUpdater}
          textDistance={60}
        />
      </RotationContainer>
      <Box
        sx={{
          position: "absolute",
          zIndex: 5,
          left: percent(50),
          top: px(-25),
          transform: "translate(-50%, 0%)",
        }}
      >
        <Triangle
          w={50}
          h={60}
          color={darkMode ? Colors.white : Colors.black}
          border={darkMode ? Colors.black : Colors.white}
        />
      </Box>
    </Box>
  );
};

export const RotationContainer = styled("div")<{
  startSpinningTime: number;
  continueSpinningTime: number;
  stopSpinningTime: number;
  startRotationDegrees: number;
  finalRotationDegrees: number;
}>(
  ({
    startSpinningTime,
    continueSpinningTime,
    stopSpinningTime,
    startRotationDegrees,
    finalRotationDegrees,
  }) => ({
    position: "absolute",
    width: percent(100),
    left: px(0),
    right: px(0),
    top: px(0),
    bottom: px(0),
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transform: `rotate(${startRotationDegrees}deg)`,
    "&.started-spinning": {
      animation: `spin ${startSpinningTime / 1000}s cubic-bezier(
          0.71,
          0,
          0.96,
          0.9
        ) 0s 1 normal forwards running,
      continueSpin ${continueSpinningTime / 1000}s linear ${
        startSpinningTime / 1000
      }s 1 normal forwards running,
      stopSpin ${stopSpinningTime / 1000}s cubic-bezier(0, 0, 0.35, 1.02) ${
        (startSpinningTime + continueSpinningTime) / 1000
      }s 1 normal forwards
        running`,
    },

    "@keyframes spin": {
      from: {
        transform: `rotate(${startRotationDegrees}deg)`,
      },
      to: {
        transform: `rotate(${startRotationDegrees + 360}deg)`,
      },
    },
    "@keyframes continueSpin": {
      from: {
        transform: `rotate(${startRotationDegrees}deg)`,
      },
      to: {
        transform: `rotate(${startRotationDegrees + 360}deg)`,
      },
    },
    "@keyframes stopSpin": {
      from: {
        transform: `rotate(${startRotationDegrees}deg)`,
      },
      to: {
        transform: `rotate(${1440 + finalRotationDegrees}deg)`,
      },
    },
  })
);
