import { Avatar, Badge, Box } from "@mui/material";
import { percent } from "csx";
import { BadgeLevel } from "src/icons/BadgeLevel";
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
  avatar?: string;
  badge?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
  level?: number;
}

export const AvatarAccountBadge = ({
  profile,
  avatar,
  badge,
  backgroundColor = Colors.white,
  size = 30,
  color,
  level,
}: PropsAvatarAccountBadge) => {
  return badge || profile.badge ? (
    <Badge
      overlap="circular"
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      badgeContent={
        <Avatar
          sx={{ width: size / 2.5, height: size / 2.5 }}
          src={badge ? badge : profile.badge!.icon}
        />
      }
    >
      <Box sx={{ position: "relative" }}>
        <Avatar
          alt="Avatar"
          src={avatar ? avatar : profile.avatar.icon}
          sx={{
            width: size,
            height: size,
            border: color ? `${size / 20}px solid ${Colors.black2}` : "none",
            backgroundColor: backgroundColor,
            "&>img": {
              width: percent(90),
              height: percent(90),
              transform: "translate(0%, 3px)",
            },
          }}
        />
        {level !== undefined && (
          <Box
            sx={{
              position: "absolute",
              left: percent(50),
              transform: "translate(-50%, -50%)",
            }}
          >
            <BadgeLevel level={level} size={size / 3} fontSize={size / 6} />
          </Box>
        )}
      </Box>
    </Badge>
  ) : (
    <Box sx={{ position: "relative" }}>
      <Avatar
        alt="Avatar"
        src={avatar ? avatar : profile.avatar.icon}
        sx={{
          width: size,
          height: size,
          border: color ? `${size / 20}px solid ${Colors.black2}` : "none",
          backgroundColor: Colors.white,
          "&>img": {
            width: percent(90),
            height: percent(90),
            transform: "translate(0%, 3px)",
          },
        }}
      />
      {level !== undefined && (
        <Box
          sx={{
            position: "absolute",
            left: percent(50),
            transform: "translate(-50%, -50%)",
          }}
        >
          <BadgeLevel level={level} size={size / 3} fontSize={size / 6} />
        </Box>
      )}
    </Box>
  );
};
