import { Title } from "src/models/Title";
import { JsonLanguageBlock } from "../JsonLanguageBlock";

interface Props {
  title: Title | null;
}

export const ProfileTitleBlock = ({ title }: Props) => {
  return (
    title && (
      <JsonLanguageBlock
        variant="caption"
        color="text.secondary"
        value={title.name}
      />
    )
  );
};
