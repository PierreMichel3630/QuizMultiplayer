import { Toolbar } from "@mui/material";
import { important, px } from "csx";
import { useApp } from "src/context/AppProvider";

export const DefaultToolbar = () => {
  const { headerSize } = useApp();
  return <Toolbar sx={{ minHeight: important(px(headerSize)) }} />;
};
