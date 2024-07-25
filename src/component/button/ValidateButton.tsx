import { useTranslation } from "react-i18next";

import CancelIcon from "@mui/icons-material/Cancel";
import CheckIcon from "@mui/icons-material/Check";
import { ButtonColor } from "../Button";
import { Colors } from "src/style/Colors";
import { useMemo } from "react";
interface Props {
  validate: boolean;
  onClick: () => void;
}

export const ValidateButton = ({ validate, onClick }: Props) => {
  const { t } = useTranslation();

  const color = useMemo(
    () => (validate ? Colors.green : Colors.red),
    [validate]
  );
  const label = useMemo(
    () =>
      validate ? t("commun.validatequestion") : t("commun.deniedquestion"),
    [t, validate]
  );
  const icon = useMemo(() => (validate ? CheckIcon : CancelIcon), [validate]);

  return (
    <ButtonColor
      value={color}
      label={label}
      icon={icon}
      variant="contained"
      onClick={onClick}
    />
  );
};
