import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { Avatar, Grid } from "@mui/material";
import { percent, viewHeight } from "csx";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";
import { Avatar as AvatarInterface } from "src/models/Avatar";
import { Colors } from "src/style/Colors";

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
          <Grid item key={avatar.id} sx={{ position: "relative" }}>
            {isSelect && (
              <CheckCircleTwoToneIcon
                sx={{
                  color: Colors.green2,
                  position: "absolute",
                  backgroundColor: "white",
                  borderRadius: percent(50),
                  top: 0,
                  right: 0,
                  transform: "translate(0%, 0%)",
                  zIndex: 2,
                }}
              />
            )}
            <Avatar
              sx={{
                cursor: "pointer",
                width: 70,
                height: 70,
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
