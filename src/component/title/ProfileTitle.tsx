import { Box, Typography } from "@mui/material";
import { TitleProfile } from "src/models/Title";
import { TextNameBlock } from "../language/TextLanguageBlock";

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
        <TextNameBlock
          component="span"
          variant="caption"
          values={titleprofile.title.titletranslation}
        />
      </Box>
    )
  );
};
