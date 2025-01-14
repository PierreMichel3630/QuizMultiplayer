import { Box, Typography } from "@mui/material";
import { percent, px } from "csx";
import { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { Colors } from "src/style/Colors";

interface PropsRoundLinkButton {
  title: string;
  icon: string;
  link: string;
}

export const RoundLinkButton = ({
  title,
  icon,
  link,
}: PropsRoundLinkButton) => {
  return (
    <Link to={link} style={{ textDecoration: "none" }}>
      <Box
        sx={{
          width: px(80),
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          textAlign: "center",
          gap: px(2),
        }}
      >
        <Box
          sx={{
            backgroundColor: Colors.blue3,
            width: px(60),
            height: px(60),
            borderRadius: percent(50),
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img alt={title} src={icon} width={40} />
        </Box>
        <Typography variant="h6" sx={{ lineHeight: 1 }}>
          {title}
        </Typography>
      </Box>
    </Link>
  );
};

interface Props {
  title: string;
  icon: JSX.Element;
  onClick: (ev: MouseEvent<HTMLElement>) => void;
  color?: string;
}

export const RoundButton = ({
  title,
  icon,
  onClick,
  color = Colors.blue3,
}: Props) => {
  return (
    <Box
      sx={{
        width: px(80),
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignContent: "center",
        alignItems: "center",
        textAlign: "center",
        gap: px(2),
      }}
      onClick={onClick}
    >
      <Box
        sx={{
          backgroundColor: color,
          width: px(40),
          height: px(40),
          borderRadius: percent(50),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography variant="h6" sx={{ lineHeight: 1 }}>
        {title}
      </Typography>
    </Box>
  );
};
