import { Box } from "@mui/material";
import { percent, px } from "csx";
import { Color } from "../models/Color";

import CancelTwoToneIcon from "@mui/icons-material/CancelTwoTone";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Colors } from "src/style/Colors";

interface Props {
  color: Color;
  selected: boolean;
  onSelect: () => void;
}

export const ColorSelector = ({ color, selected, onSelect }: Props) => (
  <Box
    sx={{
      backgroundColor: color.code,
      width: px(50),
      height: px(50),
      borderRadius: px(10),
      position: "relative",
      cursor: "pointer",
    }}
    onClick={onSelect}
  >
    {selected ? (
      <CheckCircleTwoToneIcon
        sx={{
          color: Colors.green2,
          position: "absolute",
          backgroundColor: "white",
          borderRadius: percent(50),
          top: 0,
          right: 0,
          transform: "translate(30%, -30%)",
        }}
      />
    ) : (
      <CancelTwoToneIcon
        sx={{
          color: Colors.red2,
          position: "absolute",
          backgroundColor: "white",
          borderRadius: percent(50),
          top: 0,
          right: 0,
          transform: "translate(30%, -30%)",
        }}
      />
    )}
  </Box>
);
