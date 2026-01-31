import { Toolbar } from "@mui/material";
import { important, px } from "csx";
import { useAppBar } from "src/context/AppBarProvider";

export const DefaultToolbar = () => {
  const { top } = useAppBar();
  return <Toolbar sx={{ minHeight: important(px(top)) }} />;
};
