import { FormControlLabel } from "@mui/material";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CustomSwitch } from "../Switch";

interface Props {
  multicompte: boolean;
  onChange: (value: boolean) => void;
}

export const MultiAccountSwitch = ({ multicompte, onChange }: Props) => {
  const { t } = useTranslation();

  const label = useMemo(
    () =>
      multicompte
        ? t("commun.multiaccountactivate")
        : t("commun.multiaccountdesactivate"),
    [multicompte, t],
  );

  const onChangeMulticompte = (
    _event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
  ) => {
    onChange(!checked);
  };

  return (
    <FormControlLabel
      control={
        <CustomSwitch checked={!multicompte} onChange={onChangeMulticompte} />
      }
      sx={{
        ml: 0,
        mr: 0,
        gap: 1,
      }}
      label={label}
    />
  );
};
