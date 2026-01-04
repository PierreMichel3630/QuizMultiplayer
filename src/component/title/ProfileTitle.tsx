import { TitleProfile } from "src/models/Title";
import { TitleText } from "./Title";

interface PropsProfileTitleBlock {
  titleprofile: TitleProfile | null;
}

export const ProfileTitleBlock = ({ titleprofile }: PropsProfileTitleBlock) => {
  return (
    titleprofile?.title && <TitleText value={titleprofile} variant="caption" />
  );
};
