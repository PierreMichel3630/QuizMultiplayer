import { Box, SxProps, Theme, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useMemo, useState } from "react";
import head from "src/assets/head.png";
import { Colors } from "src/style/Colors";

interface Props {
  title: string;
  extra?: JSX.Element;
  sx?: SxProps<Theme>;
}
export const HeadTitle = ({ title, extra, sx }: Props) => {
  const [width, setWidth] = useState(
    window.innerWidth > 1200 ? 1200 : window.innerWidth
  );
  const proportionImg = 0.472;
  const HEIGHTMAX = 350;

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth > 1200 ? 1200 : window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const height = useMemo(() => proportionImg * width, [proportionImg, width]);

  return (
    <Box sx={{ position: "relative" }}>
      <Box
        sx={{
          width: px(width),
          height: height > HEIGHTMAX ? HEIGHTMAX : px(height),
          backgroundColor: Colors.blue3,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: percent(100),
          maxHeight: HEIGHTMAX,
        }}
      >
        <img
          src={head}
          style={{
            width: percent(100),
            maxHeight: HEIGHTMAX,
            objectFit: "cover",
          }}
        />
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: percent(50),
          left: percent(50),
          transform: "translate(-50%, -50%)",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          color="text.secondary"
          sx={{ ...sx, minWidth: "auto" }}
        >
          {title}
        </Typography>
        {extra && extra}
      </Box>
    </Box>
  );
};
