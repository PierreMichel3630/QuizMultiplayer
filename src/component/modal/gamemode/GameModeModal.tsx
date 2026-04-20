import { TypeGameMode } from "src/models/enum/GameMode";
import { AimDetailDialog } from "./AimDetailDialog";
import { ReactionTimeDetailDialog } from "./ReactionTimeDetailDialog";
import {
  DefaultGameModeDialog,
  PropsDialogGameMode,
} from "./DefaultGameModeDialog";
import { GameModeScore } from "src/models/GameMode";

const MODAL_COMPONENTS: Partial<
  Record<TypeGameMode, React.FC<PropsDialogGameMode>>
> = {
  [TypeGameMode.reactiontime]: ReactionTimeDetailDialog,
  [TypeGameMode.aimtrainer]: AimDetailDialog,
};

export const GameModeDialog = ({
  type,
  data,
  open,
  close,
}: {
  type: TypeGameMode;
  data?: GameModeScore;
  open: boolean;
  close: () => void;
}) => {
  const SelectedDialog = MODAL_COMPONENTS[type] ?? DefaultGameModeDialog;

  return <SelectedDialog data={data} open={open} close={close} />;
};
