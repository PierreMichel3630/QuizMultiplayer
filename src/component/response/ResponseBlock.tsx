import { Typography } from "@mui/material";
import { useMemo } from "react";
import { JsonLanguage } from "src/models/Language";

interface Props {
  label: string | JsonLanguage;
}

export const ResponseBlock = ({ label }: Props) => {
  const text = useMemo(() => {
    return typeof label === "string" ? label : label["fr-FR"];
  }, [label]);

  return <Typography variant="h3">{text ?? ""}</Typography>;
};
