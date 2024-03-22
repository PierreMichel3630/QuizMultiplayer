import { Avatar } from "@mui/material";
import { AVATARS } from "./Avatar";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Colors } from "src/style/Colors";

interface Props {
  avatar: string | null;
  size?: number;
  color?: string;
}

export const AvatarAccount = ({ avatar, size, color }: Props) => {
  const DEFAULT_SIZE = 30;
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
        width: size ? size : DEFAULT_SIZE,
        height: size ? size : DEFAULT_SIZE,
        border: color ? `3px solid ${color}` : "none",
        backgroundColor: Colors.white,
      }}
    />
  );
};
