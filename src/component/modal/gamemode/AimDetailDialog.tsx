import { useMemo } from "react";
import {
  ExtraAim,
  TargetResult,
} from "src/pages/modes/braintest/games/AimPage";
import {
  DefaultGameModeDialog,
  PropsDialogGameMode,
} from "./DefaultGameModeDialog";

export const AimDetailDialog = ({ data, open, close }: PropsDialogGameMode) => {
  const extraValue: {
    width?: number;
    height?: number;
    targets: Array<TargetResult>;
  } = useMemo(() => data?.extra, [data]);

  const extra = useMemo(
    () => extraValue && <ExtraAim value={extraValue} />,
    [extraValue],
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
