import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { BadgeCount } from "../badge/BadgeCount";

interface Props {
  title: string | JSX.Element;
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
        title
      )}
      {count !== undefined && <BadgeCount count={count} />}
    </Box>
  );
};
