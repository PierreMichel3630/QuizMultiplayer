import { Typography } from "@mui/material";
import moment from "moment";
import { TypeDataEnum } from "src/models/enum/TypeDataEnum";
import { ExtraResponse } from "src/models/Response";
import { Colors } from "src/style/Colors";

interface Props {
  extra: ExtraResponse;
}

export const ExtraResponseBlock = ({ extra }: Props) => {
  const value =
    extra.type === TypeDataEnum.DATE
      ? moment(extra.value).format(extra.format)
      : extra.value;
  return (
    <Typography
      variant="h6"
      component="p"
      sx={{
        color: Colors.white,
        textShadow: "1px 1px 10px black",
      }}
    >
      {value}
    </Typography>
  );
};
