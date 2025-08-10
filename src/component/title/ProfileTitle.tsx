import { Box, Typography } from "@mui/material";
import { TitleProfile } from "src/models/Title";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

interface PropsProfileTitleBlock {
  titleprofile: TitleProfile | null;
}

export const ProfileTitleBlock = ({ titleprofile }: PropsProfileTitleBlock) => {
  return (
    titleprofile?.title && (
      <Box>
        {titleprofile.multiplicator !== null && (
          <Typography variant="caption" component="span">
            {titleprofile.multiplicator} x{" "}
          </Typography>
        )}
        <JsonLanguageBlock
          component="span"
          variant="caption"
          value={titleprofile.title.name}
        />
      </Box>
    )
  );
};
