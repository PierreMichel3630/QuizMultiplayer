import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Card,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Switch,
  Typography,
} from "@mui/material";
import { px } from "csx";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Profile } from "src/models/Profile";
import { AvatarAccount } from "../avatar/AvatarAccount";
import { FriendButton } from "../FriendButton";
import { ProfileAdminBlock, ProfileBlock } from "../profile/ProfileBlock";
import { StatusProfileBlock } from "../StatusProfileBlock";
import { updateProfil } from "src/api/profile";

import VisibilityIcon from "@mui/icons-material/Visibility";

interface Props {
  profile: Profile;
  addToFriend?: () => void;
  deleteToFriend?: () => void;
  onSelect?: () => void;
}

export const CardProfile = ({
  profile,
  addToFriend,
  deleteToFriend,
  onSelect,
}: Props) => {
  const { t } = useTranslation();

  const add = (event: any) => {
    event.preventDefault();
    if (addToFriend) addToFriend();
  };

  const remove = (event: any) => {
    event.preventDefault();
    if (deleteToFriend) deleteToFriend();
  };

  const select = (event: any) => {
    event.preventDefault();
    if (onSelect) onSelect();
  };

  return (
    <Card
      sx={{ p: 1, cursor: onSelect ? "pointer" : "default" }}
      onClick={select}
      variant="outlined"
    >
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid>
          <AvatarAccount avatar={profile.avatar.icon} size={50} />
        </Grid>
        <Grid size="grow">
          <Typography variant="h4" sx={{ wordWrap: "break-word" }}>
            {profile.username}
          </Typography>
          <StatusProfileBlock online={profile.isonline} />
        </Grid>

        {addToFriend && (
          <Grid size={12}>
            <Button
              variant="contained"
              size="small"
              color="success"
              fullWidth
              onClick={add}
              startIcon={<AddCircleIcon />}
            >
              <Typography variant="h6">{t("commun.addtofriend")}</Typography>
            </Button>
          </Grid>
        )}
        {deleteToFriend && (
          <Grid size={12}>
            <Button
              variant="contained"
              size="small"
              color="error"
              startIcon={<DeleteIcon />}
              fullWidth
              onClick={remove}
            >
              <Typography variant="h6">{t("commun.delete")}</Typography>
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};

interface PropsBasic {
  profile: Profile;
}
export const BasicCardProfile = ({ profile }: PropsBasic) => {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        cursor: "pointer",
        p: px(5),
      }}
      elevation={8}
      onClick={() => navigate(`/profil/${profile.id}`)}
    >
      <ProfileBlock
        variant="h6"
        profile={profile}
        extra={<FriendButton profile={profile} small />}
        avatarSize={45}
      />
    </Paper>
  );
};

interface PropsBasic {
  profile: Profile;
}
export const BasicCardFriendProfile = ({ profile }: PropsBasic) => {
  const navigate = useNavigate();

  return (
    <Paper
      sx={{
        cursor: "pointer",
        p: px(5),
      }}
      elevation={8}
      onClick={() => navigate(`/profil/${profile.id}`)}
    >
      <ProfileBlock
        variant="h6"
        profile={profile}
        extra={<FriendButton profile={profile} small />}
        avatarSize={45}
      />
    </Paper>
  );
};

interface PropsCardAdminProfile {
  profile: Profile;
  refresh: (profile: Profile) => void;
  select: (profile: Profile) => void;
}

export const CardAdminProfile = ({
  profile,
  refresh,
  select
}: PropsCardAdminProfile) => {
  const onChangeMulticompte = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    const newProfile = {
      id: profile.id,
      multicompte: checked,
    };

    updateProfil(newProfile).then(({ data }) => {
      refresh(data);
    });
  };
  return (
    <Card sx={{ p: 1 }} variant="outlined">
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid size="grow">
          <ProfileAdminBlock variant="h6" profile={profile} avatarSize={45} />
        </Grid>
        <Grid sx={{ display: "flex", alignItems: "center" }}>
          <FormControlLabel
            control={
              <Switch
                checked={profile.multicompte}
                onChange={onChangeMulticompte}
              />
            }
            label="Multicompte"
          />
          <IconButton aria-label="detail" onClick={() => select(profile)}>
            <VisibilityIcon fontSize="inherit" />
          </IconButton>
        </Grid>
      </Grid>
    </Card>
  );
};
