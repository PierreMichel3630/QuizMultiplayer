import { Title, TitleProfile } from "src/models/Title";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { Box, Typography } from "@mui/material";

interface Props {
  title: Title | null;
}

export const TitleBlock = ({ title }: Props) => {
  return (
    title && (
      <JsonLanguageBlock
        variant="caption"
        color="text.secondary"
        value={title.name}
      />
    )
  );
};

interface PropsProfileTitleBlock {
  titleprofile: TitleProfile | null;
}

export const ProfileTitleBlock = ({ titleprofile }: PropsProfileTitleBlock) => {
  return (
    titleprofile?.title && (
      <Box>
        {titleprofile.multiplicator !== null && (
          <Typography
            variant="caption"
            component="span"
            sx={{ textShadow: "1px 1px 2px black" }}
          >
            {titleprofile.multiplicator} x{" "}
          </Typography>
        )}
        <JsonLanguageBlock
          component="span"
          variant="caption"
          color="text.secondary"
          sx={{ textShadow: "1px 1px 2px black" }}
          value={titleprofile.title.name}
        />
      </Box>
    )
  );
};
