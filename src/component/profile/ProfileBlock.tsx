import { Box, Typography, TypographyVariant } from "@mui/material";
import { Profile } from "src/models/Profile";
import { AvatarAccountBadge } from "../avatar/AvatarAccount";
import { CountryImageBlock } from "../CountryBlock";
import { ProfileTitleBlock } from "../title/ProfileTitle";

import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { px } from "csx";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { StreakBlock } from "../StreakBlock";
interface Props {
  profile: Profile;
  extra?: JSX.Element;
  avatarSize?: number;
  variant?: TypographyVariant;
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
              flex:1
            }}
          >
            {profile.username}
          </Typography>
          {!!(profile.streak) && (
            <StreakBlock value={profile.streak} logoSize={30} textSize={20} />
          )}
        </Box>
        <ProfileTitleBlock titleprofile={profile.titleprofile} />
      </Box>
      {extra && <Box sx={{ flex: "0 0 auto" }}>{extra}</Box>}
    </Box>
  );
};

export const ProfileAdminBlock = ({
  profile,
  avatarSize = 60,
  variant = "h2",
  extra,
}: Props) => {
  const { t } = useTranslation();
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
          {profile.isadmin && (
            <Box sx={{ display: "flex", alignItems: "center", gap: px(2) }}>
              <ManageAccountsIcon fontSize="small" />
              <Typography variant="caption">ADMIN</Typography>
            </Box>
          )}
          {profile.isbot && (
            <Box sx={{ display: "flex", alignItems: "center", gap: px(2) }}>
              <SmartToyIcon fontSize="small" />
              <Typography variant="caption">BOT</Typography>
            </Box>
          )}
        </Box>
        <Box>
          <Typography variant="caption">
            {t("commun.createdat", {
              date: moment(profile.created_at).format("DD/MM/YYYY HH:mm:ss"),
            })}
          </Typography>
        </Box>
      </Box>
      {extra && <Box sx={{ flex: "0 0 auto" }}>{extra}</Box>}
    </Box>
  );
};
