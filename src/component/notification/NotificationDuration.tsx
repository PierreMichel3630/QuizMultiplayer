import { Typography } from "@mui/material";
import moment from "moment";

interface Props {
  date: Date;
}

export const NotificationDuration = ({ date }: Props) => {
  return <Typography variant="caption">{moment(date).fromNow()}</Typography>;
};
