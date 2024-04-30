import { Box, Button, Paper, Typography } from "@mui/material";
import { Profile } from "src/models/Profile";

import DeleteIcon from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { Colors } from "src/style/Colors";
import { AvatarAccount } from "./avatar/AvatarAccount";

interface Props {
  profile?: Profile;
  onChange: () => void;
  onDelete: () => void;
}

export const SelectorProfileBlock = ({
  profile,
  onChange,
  onDelete,
}: Props) => {
  const { t } = useTranslation();

  return (
    <Box>
      {profile ? (
        <Paper
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 1,
            cursor: "pointer",
            justifyContent: "space-between",
            backgroundColor: Colors.lightgrey,
          }}
          onClick={onChange}
        >
          <AvatarAccount avatar={profile.avatar.icon} size={40} />
          <Typography variant="h4">{profile.username}</Typography>
          <DeleteIcon
            sx={{ cursor: "pointer" }}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              onDelete();
            }}
          />
        </Paper>
      ) : (
        <Button variant="contained" fullWidth onClick={onChange}>
          <Typography variant="h6">{t("commun.selectadv")}</Typography>
        </Button>
      )}
    </Box>
  );
};
