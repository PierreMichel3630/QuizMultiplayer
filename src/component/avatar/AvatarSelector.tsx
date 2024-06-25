import { Avatar, Grid } from "@mui/material";
import { viewHeight } from "csx";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Avatar as AvatarInterface } from "src/models/Avatar";

interface Props {
  onSelect: (value: AvatarInterface) => void;
}

export const AvatarSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { avatars } = useApp();

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      sx={{ maxHeight: viewHeight(20), overflowX: "scroll" }}
    >
      {avatars.map((avatar) => {
        const isSelect = profile && profile.avatar.id === avatar.id;
        return (
          <Grid item key={avatar.id}>
            <Avatar
              sx={{
                cursor: "pointer",
                border: isSelect ? "5px solid green" : "5px solid white",
                width: 60,
                height: 60,
              }}
              src={avatar.icon}
              onClick={() => onSelect(avatar)}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};
