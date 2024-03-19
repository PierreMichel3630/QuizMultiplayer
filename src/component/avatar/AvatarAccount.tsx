import { Avatar } from "@mui/material";
import { AVATARS } from "./Avatar";
import { useAuth } from "src/context/AuthProviderSupabase";

interface Props {
  avatar: string | null;
  size?: number;
}

export const AvatarAccount = ({ avatar, size }: Props) => {
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
      }}
    />
  );
};
