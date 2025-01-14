import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { JsonLanguage } from "src/models/Language";
import { BadgeCount } from "../badge/BadgeCount";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

interface Props {
  title: string | JsonLanguage;
  count?: number;
}

export const TitleCount = ({ title, count }: Props) => {
  return (
    <Box sx={{ display: "flex", gap: px(15), alignItems: "center" }}>
      {typeof title === "string" ? (
        <Typography variant="h2" noWrap>
          {title}
        </Typography>
      ) : (
        <JsonLanguageBlock
          variant="h2"
          value={title}
          sx={{
            overflow: "hidden",
            display: "block",
            lineClamp: 1,
            boxOrient: "vertical",
          }}
          noWrap
        />
      )}
      {count && <BadgeCount count={count} />}
    </Box>
  );
};
