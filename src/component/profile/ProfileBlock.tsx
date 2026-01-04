import { Box, Typography } from "@mui/material";
import { Profile } from "src/models/Profile";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";
import { CountryImageBlock } from "../CountryBlock";
import { ProfileTitleBlock } from "../title/ProfileTitle";
import { Variant } from "@mui/material/styles/createTypography";

interface Props {
  profile: Profile;
  extra?: JSX.Element;
  avatarSize?: number;
  variant?: Variant;
}

export const ProfileBlock = ({
  profile,
  avatarSize = 60,
  variant = "h2",
  extra,
}: Props) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ flex: "0 0 auto" }}>
        <AvatarAccountBadge profile={profile} size={avatarSize} />
      </Box>

      <Box sx={{ flex: "1 1 auto", overflow: "hidden" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            minWidth: 0,
          }}
        >
          {profile.country && <CountryImageBlock country={profile.country} />}
          <Typography
            variant={variant}
            sx={{
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
            }}
          >
            {profile.username}
          </Typography>
        </Box>
        <ProfileTitleBlock titleprofile={profile.titleprofile} />
      </Box>
      {extra && <Box sx={{ flex: "0 0 auto" }}>{extra}</Box>}
    </Box>
  );
};
