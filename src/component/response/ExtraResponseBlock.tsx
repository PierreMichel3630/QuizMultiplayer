import { Typography } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";
import { TypeDataEnum } from "src/models/enum/TypeDataEnum";
import { ExtraResponse } from "src/models/Response";
import { Colors } from "src/style/Colors";

interface Props {
  extra: ExtraResponse;
  shadow?: boolean;
}

export const ExtraResponseBlock = ({ extra, shadow = true }: Props) => {
  const value = useMemo(() => {
    let result = extra.value;
    if (extra.type === TypeDataEnum.DATE) {
      result = moment(extra.value, extra.format).format(extra.format);
    } else if (extra.type === TypeDataEnum.NUMBER) {
      result = Number(extra.value).toLocaleString();
    }
    return result;
  }, [extra]);

  return (
    <Typography
      variant="h2"
      component="p"
      sx={{
        color: Colors.white,
        textShadow: shadow ? "1px 1px 10px black" : "none",
      }}
    >
      {value}
    </Typography>
  );
};
