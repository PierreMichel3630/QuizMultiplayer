import { Box } from "@mui/material";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "src/context/UserProvider";
import { TypeWheelEnum } from "src/models/enum/TypeWheelEnum";
import { Colors } from "src/style/Colors";

interface OptionWheel {
  value: string;
  color: string;
  text: string;
  type: TypeWheelEnum;
}

interface Props {
  launch: boolean;
}
export const AnimateWheel = ({ launch }: Props) => {
  const { mode } = useUser();
  const [angle, setAngle] = useState(0);

  const colorText = useMemo(
    () => (mode === "dark" ? Colors.white : Colors.black),
    [mode]
  );
  const colorBackground = useMemo(
    () => (mode === "dark" ? Colors.black : Colors.lightgrey),
    [mode]
  );

  const options = useMemo(
    () => [
      {
        value: "1000",
        color: Colors.red,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        color: colorBackground,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "500",
        color: Colors.pink,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        color: colorBackground,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "1000",
        color: Colors.orange,
        text: colorText,
        type: TypeWheelEnum.XP,
      },
      {
        value: "250",
        color: Colors.purple,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "5000",
        color: Colors.green,
        text: colorText,
        type: TypeWheelEnum.XP,
      },
      {
        value: "50",
        color: colorBackground,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "100",
        color: Colors.blue2,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        color: colorBackground,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "1000",
        color: Colors.orange,
        text: colorText,
        type: TypeWheelEnum.XP,
      },
      {
        value: "250",
        color: Colors.purple,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
      {
        value: "50",
        color: colorBackground,
        text: colorText,
        type: TypeWheelEnum.GOLD,
      },
    ],
    [colorText, colorBackground]
  );

  const updateAnimationState = useCallback(() => {
    let tour = 0;
    let diffAngle = 0;
    const interval = setInterval(() => {
      //console.log(diffAngle);
      if (diffAngle < 0) clearInterval(interval);
      setAngle((prev) => prev + diffAngle);
      tour < 30 ? diffAngle++ : diffAngle--;
      tour++;
    }, 100);
  }, []);

  useEffect(() => {
    if (launch) {
      updateAnimationState();
    }
  }, [launch, updateAnimationState]);

  return <Wheel angle={angle} options={options} />;
};

interface PropsWheel {
  angle: number;
  options: Array<OptionWheel>;
}

export const Wheel = ({ angle, options }: PropsWheel) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divCanvasRef = useRef<HTMLDivElement | null>(null);
  const srcXp = "/src/assets/xp.svg";
  const srcGold = "/src/assets/money.svg";

  const [width, setWidth] = useState(300);

  useEffect(() => {
    if (canvasRef.current && divCanvasRef.current) {
      drawWheel(angle);
    }
  }, [canvasRef.current, divCanvasRef.current, angle]);

  useEffect(() => {
    if (divCanvasRef.current) {
      const size = divCanvasRef.current.clientWidth;
      setWidth(size > 600 ? 600 : size);
    }
  }, [divCanvasRef.current]);

  const drawWheel = async (angle: number) => {
    const numberOptions = options.length;
    const canvas = canvasRef.current!;
    const contextCanvas = canvas.getContext("2d")!;

    const rotation = angle;
    const widthIcon = canvas.width / 13;
    const textSize = canvas.width / 20;
    const radius = canvas.width / 2;
    const sliceAngle = (2 * Math.PI) / numberOptions;

    // Effacer précédent
    contextCanvas.setTransform(1, 0, 0, 1, 0, 0);
    contextCanvas.clearRect(0, 0, canvas.width, canvas.height);
    contextCanvas.translate(radius, radius);
    contextCanvas.rotate(-rotation * (Math.PI / 180));

    // Load image

    const imageGold = new Image();
    imageGold.src = srcGold;
    await imageGold.decode();

    const imageXp = new Image();
    imageXp.src = srcXp;
    await imageXp.decode();

    // Dessiner Option
    options.forEach(async (option, i) => {
      const color = option.color;
      const label = option.value;
      const type = option.type;
      const radiusOption = radius;

      const startAngle = i * sliceAngle;
      const endAngle = (i + 1) * sliceAngle;
      contextCanvas.beginPath();
      contextCanvas.moveTo(0, 0);
      contextCanvas.arc(0, 0, radius, startAngle, endAngle);
      contextCanvas.closePath();
      contextCanvas.fillStyle = color;

      contextCanvas.fill();
      contextCanvas.strokeStyle = "white";
      contextCanvas.stroke();

      // Draw the name in the sector
      contextCanvas.save();
      contextCanvas.rotate((startAngle + endAngle) / 2);
      contextCanvas.textAlign = "start";
      contextCanvas.textBaseline = "middle";
      contextCanvas.fillStyle = "white";
      contextCanvas.font = `bold  ${textSize}px Montserrat,sans-serif`;
      const sizeLabel = contextCanvas.measureText(label);
      contextCanvas.fillText(
        label,
        radius - (sizeLabel.width + widthIcon * 1.3),
        0
      );

      const image = type === TypeWheelEnum.GOLD ? imageGold : imageXp;
      contextCanvas.drawImage(
        image,
        radiusOption - widthIcon * 1.2,
        -(widthIcon / 2),
        widthIcon,
        widthIcon
      );
      contextCanvas.restore();
    });

    // Dessiner centre indicateur (cf https://dev.to/sababg/custom-wheel-of-prize-with-canvas-589h)
    contextCanvas.beginPath();
    contextCanvas.arc(0, 0, canvas.width * 0.1, 0, 2 * Math.PI);
    contextCanvas.fillStyle = "white";
    contextCanvas.closePath();
    contextCanvas.fill();
    contextCanvas.lineWidth = 4;
    contextCanvas.strokeStyle = "grey";
    contextCanvas.stroke();
    contextCanvas.rotate(rotation * (Math.PI / 180));
    contextCanvas.beginPath();
    contextCanvas.moveTo(0, -canvas.width * 0.15);
    contextCanvas.lineTo(canvas.width * 0.09, 0);
    contextCanvas.lineTo(-canvas.width * 0.09, 0);
    contextCanvas.fill();
  };

  return (
    <Box
      ref={divCanvasRef}
      sx={{
        flex: "1 1 0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={width}
        style={{ borderRadius: "50%", border: "5px solid white" }}
      />
    </Box>
  );
};
