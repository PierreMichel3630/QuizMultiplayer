import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button, Card, Grid, Paper, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Profile } from "src/models/Profile";
import { FriendButton } from "../FriendButton";
import { AvatarAccount } from "../avatar/AvatarAccount";
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
      <Grid container spacing={1} alignItems="center" justifyContent="center">
        <Grid item>
          <AvatarAccount avatar={profile.avatar.icon} size={60} />
        </Grid>
        <Grid item>
          <Typography variant="h2" sx={{ wordWrap: "break-word" }}>
            {profile.username}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 10, wordWrap: "break-word" }}
          >
            {t("commun.createdthe", {
              value: moment(profile.created_at).format("DD MMMM YYYY"),
            })}
          </Typography>
        </Grid>

        {addToFriend && (
          <Grid item xs={12}>
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
          <Grid item xs={12}>
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
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        cursor: "pointer",
        p: px(5),
      }}
      onClick={() => navigate(`/profil/${profile.id}`)}
    >
      <AvatarAccount
        avatar={profile.avatar.icon}
        size={50}
        color={profile.color}
      />
      <Typography variant="h6" sx={{ wordWrap: "break-word" }}>
        {profile.username}
      </Typography>
      <FriendButton profile={profile} small />
    </Paper>
  );
};
