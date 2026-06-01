import { useTheme, useMediaQuery } from "@mui/material";

export function useIsMobileOrTablet() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down("lg"));
}
