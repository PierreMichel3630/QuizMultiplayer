import { Box } from "@mui/material";
import { percent, px } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  isRead: boolean;
}

export const IsReadNotificationBlock = ({ isRead }: Props) => {
  const SIZE = 10;
  return (
    !isRead && (
      <Box
        sx={{
          minWidth: px(SIZE),
          minHeight: px(SIZE),
          width: px(SIZE),
          height: px(SIZE),
          borderRadius: percent(50),
          backgroundColor: Colors.red,
        }}
      />
    )
  );
};
