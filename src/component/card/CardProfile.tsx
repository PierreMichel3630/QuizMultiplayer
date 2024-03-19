import { Button, Card, Grid, Typography } from "@mui/material";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Profile } from "src/models/Profile";
import { AvatarAccount } from "../avatar/AvatarAccount";
import DeleteIcon from "@mui/icons-material/Delete";

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
    >
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <AvatarAccount avatar={profile.avatar} size={60} />
        </Grid>
        <Grid item xs={9}>
          <Typography variant="h2" sx={{ wordWrap: "break-word" }}>
            {`${profile.firstname} ${profile.lastname}`}
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
            <Button variant="contained" size="small" fullWidth onClick={add}>
              {t("commun.addtofriend")}
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
              {t("commun.delete")}
            </Button>
          </Grid>
        )}
      </Grid>
    </Card>
  );
};
