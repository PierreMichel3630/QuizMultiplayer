import { useMemo } from "react";
import { ExtraReactionTime } from "src/pages/modes/braintest/games/ReactionTimePage";
import {
  DefaultGameModeDialog,
  PropsDialogGameMode,
} from "./DefaultGameModeDialog";

export const ReactionTimeDetailDialog = ({
  data,
  open,
  close,
}: PropsDialogGameMode) => {
  const attempts: Array<number> = useMemo(
    () => data?.extra?.attempts ?? [],
    [data],
  );

  const extra = useMemo(
    () => (
      <ExtraReactionTime attempts={attempts} fixed={2} />
    ),
    [attempts],
  );

  return (
    <DefaultGameModeDialog
      data={data}
      open={open}
      close={close}
      extra={extra}
      fixed={2}
      unit="ms"
    />
  );
};
