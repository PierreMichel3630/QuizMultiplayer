import { AlertColor } from "@mui/material";
import { px } from "csx";
import { createContext, useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { MessageSnackbar } from "src/component/Snackbar";

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const MessageContext = createContext<{
  message: string;
  severity: AlertColor;
  setMessage: (value: string) => void;
  setSeverity: (value: AlertColor) => void;
}>({
  message: "",
  severity: "error",
  setMessage: () => {},
  setSeverity: () => {},
});

export const useMessage = () => useContext(MessageContext);

export const MessageProvider = ({ children }: Props) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("error");

  return (
    <MessageContext.Provider
      value={{
        message,
        setMessage,
        severity,
        setSeverity,
      }}
    >
      {children}
      <MessageSnackbar
        autoHideDuration={5000}
        open={message !== ""}
        handleClose={() => setMessage("")}
        message={navigator.onLine ? message : t("alert.nointernet")}
        severity={severity}
        sx={{ mb: px(60) }}
      />
    </MessageContext.Provider>
  );
};
