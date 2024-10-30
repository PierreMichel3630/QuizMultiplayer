import {
  ProfileAccomplishment,
  StatAccomplishment,
} from "src/models/Accomplishment";
import { CardAccomplishment } from "../card/CardAccomplishment";

interface Props {
  value: ProfileAccomplishment;
  stat?: StatAccomplishment;
}

export const AccomplishmentNotificationBlock = ({ value, stat }: Props) => {
  return (
    <CardAccomplishment
      accomplishment={value.accomplishment}
      stat={stat}
      badge
      title
      notification
    />
  );
};
