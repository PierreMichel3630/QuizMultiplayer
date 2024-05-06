import { Box, Button, Paper, Typography } from "@mui/material";
import { Profile } from "src/models/Profile";

import DeleteIcon from "@mui/icons-material/Delete";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "./avatar/AvatarAccount";
import { percent } from "csx";

interface Props {
  label: string;
  profile?: Profile;
  onChange: () => void;
  onDelete?: () => void;
}

export const SelectorProfileBlock = ({
  label,
  profile,
  onChange,
  onDelete,
}: Props) => {
  return (
    <Box
      sx={{
        height: percent(100),
      }}
    >
      {profile ? (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1,
            cursor: "pointer",
            justifyContent: onDelete ? "space-between" : "center",
            backgroundColor: Colors.lightgrey,
            height: percent(100),
          }}
          onClick={onChange}
        >
          <AvatarAccount avatar={profile.avatar.icon} size={40} />
          <Typography variant="h4" sx={{ wordBreak: "break-all" }}>
            {profile.username}
          </Typography>
          {onDelete && (
            <DeleteIcon
              sx={{ cursor: "pointer" }}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                onDelete();
              }}
            />
          )}
        </Paper>
      ) : (
        <Button variant="contained" fullWidth onClick={onChange}>
          <Typography variant="h6">{label}</Typography>
        </Button>
      )}
    </Box>
  );
};
