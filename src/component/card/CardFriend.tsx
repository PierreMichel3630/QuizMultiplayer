import { Button, Card, Grid, Typography } from "@mui/material";
import { px } from "csx";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { Friend } from "src/models/Friend";
import { AvatarAccount } from "../avatar/AvatarAccount";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

interface PropsCardInvitationFriend {
  friend: Friend;
  validate: () => void;
  refuse: () => void;
}

export const CardInvitationFriend = ({
  friend,
  validate,
  refuse,
}: PropsCardInvitationFriend) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ p: 1 }} variant="outlined">
      <Grid container spacing={1} justifyContent="center" alignItems="center">
        <Grid item>
          <AvatarAccount avatar={friend.user1.avatar} size={60} />
        </Grid>
        <Grid item>
          <Typography variant="h2" sx={{ wordWrap: "break-word" }}>
            {friend.user1.username}
          </Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 10, wordWrap: "break-word" }}
          >
            {t("commun.createdthe", {
              value: moment(friend.user1.created_at).format("DD MMMM YYYY"),
            })}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            color="success"
            onClick={validate}
            startIcon={<CheckCircleIcon />}
          >
            <Typography variant="h6">{t("commun.validate")}</Typography>
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button
            variant="contained"
            fullWidth
            color="error"
            onClick={refuse}
            startIcon={<CancelIcon />}
          >
            <Typography variant="h6">{t("commun.refuse")}</Typography>
          </Button>
        </Grid>
      </Grid>
    </Card>
  );
};

interface PropsCardRequestFriend {
  friend: Friend;
}

export const CardRequestFriend = ({ friend }: PropsCardRequestFriend) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ p: 1 }} variant="outlined">
      <Grid
        container
        spacing={1}
        justifyContent="space-between"
        alignItems="center"
      >
        <Grid item>
          <AvatarAccount avatar={friend.user2.avatar} size={60} />
        </Grid>
        <Grid item xs={9} sx={{ wordWrap: "break-word" }}>
          <Typography variant="h2">{friend.user2.username}</Typography>
          <Typography
            variant="caption"
            sx={{ fontSize: 10, wordWrap: "break-word" }}
          >
            {t("commun.createdthe", {
              value: moment(friend.user2.created_at).format("DD MMMM YYYY"),
            })}
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body2" component="span" sx={{ mr: px(5) }}>
            {t("commun.waitvalidation")}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 10 }} component="span">
            {moment(friend.created_at).format("DD MMMM YYYY")}
          </Typography>
        </Grid>
      </Grid>
    </Card>
  );
};
