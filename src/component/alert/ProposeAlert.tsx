import { Alert } from "@mui/material";
import { px } from "csx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StatusPropose } from "src/models/enum/Propose";

interface Props {
  value: StatusPropose;
}
export const ProposeAlert = ({ value }: Props) => {
  const { t } = useTranslation();
  const severity = useMemo(() => {
    let result: "success" | "info" | "warning" | "error" = "info";
    switch (value) {
      case StatusPropose.INPROGRESS:
        result = "info";
        break;
      case StatusPropose.MAINTENANCE:
        result = "warning";
        break;
      case StatusPropose.REFUSE:
        result = "error";
        break;
      case StatusPropose.VALIDATE:
        result = "success";
        break;
    }
    return result;
  }, [value]);
  return (
    <Alert
      severity={severity}
      sx={{
        p: px(5),
        "& .MuiAlert-message": {
          padding: 0,
        },
        "& .MuiAlert-icon": {
          padding: 0,
        },
      }}
    >
      {
        {
          VALIDATE: t("alert.validate"),
          INPROGRESS: t("alert.inprogress"),
          REFUSE: t("alert.refuse"),
          MAINTENANCE: t("alert.maintenance"),
        }[value]
      }
    </Alert>
  );
};
