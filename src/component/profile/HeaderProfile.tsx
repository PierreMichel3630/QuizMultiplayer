import { Box, Typography } from "@mui/material";
import { px } from "csx";
import { Profile } from "src/models/Profile";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";
import { CountryImageBlock } from "../CountryBlock";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

interface Props {
  profile: Profile;
}

export const HeaderProfile = ({ profile }: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <AvatarAccountBadge profile={profile} size={60} />
      <Box>
        <Box sx={{ display: "flex", gap: px(3) }}>
          {profile.country && <CountryImageBlock country={profile.country} />}
          <Typography variant="h2">{profile.username}</Typography>
        </Box>

        {profile.title && (
          <Box sx={{ maxWidth: px(180) }}>
            <JsonLanguageBlock variant="caption" value={profile.title.name} />
          </Box>
        )}
      </Box>
    </Box>
  );
};
