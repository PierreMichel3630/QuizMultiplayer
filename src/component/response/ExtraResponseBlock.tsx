import { Box, Typography } from "@mui/material";
import moment from "moment";
import { useMemo } from "react";
import { TypeDataEnum } from "src/models/enum/TypeDataEnum";
import { ExtraResponse } from "src/models/Response";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

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
    <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
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
      {extra.unit && (
        <JsonLanguageBlock
          variant="h6"
          color="text.secondary"
          value={extra.unit}
        />
      )}
    </Box>
  );
};
