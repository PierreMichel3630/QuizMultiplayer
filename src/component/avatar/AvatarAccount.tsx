import { Avatar } from "@mui/material";
import { AVATARS } from "./Avatar";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

interface Props {
  avatar: string | null;
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
  const { user } = useAuth();

  const image =
    avatar !== null
      ? AVATARS[Number(avatar)]
      : user?.user_metadata.avatar_url
      ? user?.user_metadata.avatar_url
      : AVATARS[0];

  return (
    <Avatar
      alt="Avatar"
      src={image}
      sx={{
        width: size,
        height: size,
        border: color ? `${size / 15}px solid ${color}` : "none",
        backgroundColor: backgroundColor,
      }}
    />
  );
};
