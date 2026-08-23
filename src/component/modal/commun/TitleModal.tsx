import { AppBar, IconButton, Toolbar, Typography } from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";


interface Props {
    close: () => void
    title: string |JSX.Element
}
export const TitleModal = ({title , close} :Props) => {
  return (
    <AppBar sx={{ position: "relative" }}>
      <Toolbar>
        <Typography variant="h2" component="div" sx={{ flexGrow: 1 }}>
          {title}
        </Typography>
        <IconButton color="inherit" onClick={close} aria-label="close">
          <CloseIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
