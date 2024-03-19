import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import { Box } from "@mui/material";
import { range } from "lodash";
import { Fragment } from "react";
import { Colors } from "src/style/Colors";

interface Props {
  health?: number;
}
export const HealthBlock = ({ health }: Props) => {
  const MAXHEALTH = 3;

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {range(MAXHEALTH, 0, -1).map((el) => (
        <Fragment key={el}>
          {health !== undefined && health < el ? (
            <HeartBrokenIcon
              sx={{ color: Colors.grey, width: 18, height: 18 }}
            />
          ) : (
            <FavoriteIcon sx={{ color: Colors.red, width: 18, height: 18 }} />
          )}
        </Fragment>
      ))}
    </Box>
  );
};
