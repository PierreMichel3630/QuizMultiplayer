import ShareIcon from "@mui/icons-material/Share";
import { Box } from "@mui/material";
import { useState } from "react";
import { Colors } from "src/style/Colors";
import { ButtonColor } from "./Button";
import { ShareModal } from "./modal/ShareModal";

interface Props {
  title: string;
}
export const ShareApplicationBlock = ({ title }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <Box>
      <ButtonColor
        typography="h6"
        iconSize={20}
        value={Colors.blue3}
        label={title}
        icon={ShareIcon}
        variant="contained"
        onClick={() => setOpen(true)}
      />
      <ShareModal open={open} close={() => setOpen(false)} />
    </Box>
  );
};
