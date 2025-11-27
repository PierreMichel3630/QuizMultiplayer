import { Box, Drawer } from "@mui/material";
import { drawerWidth } from "src/utils/config";
import { MenuBlock } from "../menus/MenuBlock";
import { DefaultToolbar } from "../toolbar/Toolbar";

export const DrawerMenus = () => {
  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
    >
      <DefaultToolbar />
      <Box sx={{ overflow: "auto" }}>
        <MenuBlock />
      </Box>
    </Drawer>
  );
};
