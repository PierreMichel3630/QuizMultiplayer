import { Avatar, Badge } from "@mui/material";
import { Profile } from "src/models/Profile";
import { Colors } from "src/style/Colors";

interface Props {
  avatar: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const AvatarAccount = ({
  avatar,
  backgroundColor = Colors.white,
  size = 30,
  color,
}: Props) => {
  return (
    <Avatar
      alt="Avatar"
      src={avatar}
      sx={{
        width: size,
        height: size,
        border: color ? `${size / 15}px solid ${color}` : "none",
        backgroundColor: backgroundColor,
      }}
    />
  );
};

interface PropsAvatarAccountBadge {
  profile: Profile;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export const AvatarAccountBadge = ({
  profile,
  backgroundColor = Colors.white,
  size = 30,
  color,
}: PropsAvatarAccountBadge) => {
  return profile.badge ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={
        <Avatar
          sx={{ width: size / 3.5, height: size / 3.5 }}
          src={profile.badge.icon}
        />
      }
    >
      <Avatar
        alt="Avatar"
        src={profile.avatar.icon}
        sx={{
          width: size,
          height: size,
          border: color ? `${size / 15}px solid ${color}` : "none",
          backgroundColor: backgroundColor,
        }}
      />
    </Badge>
  ) : (
    <Avatar
      alt="Avatar"
      src={profile.avatar.icon}
      sx={{
        width: size,
        height: size,
        border: color ? `${size / 15}px solid ${color}` : "none",
        backgroundColor: backgroundColor,
      }}
    />
  );
};
