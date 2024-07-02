import SortIcon from "@mui/icons-material/Sort";
import { IconButton, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import { Fragment, useState } from "react";

interface Props {
  menus: Array<{
    value: string;
    label: string;
    sort: (value: string) => void;
  }>;
}
export const SortButton = ({ menus }: Props) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Fragment>
      <Tooltip title="Account settings">
        <IconButton
          onClick={handleClick}
          size="small"
          aria-controls={open ? "account-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <SortIcon />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        sx={{ mt: "5px", pt: 0, pb: 0 }}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {menus.map((menu) => (
          <MenuItem
            key={menu.value}
            onClick={() => {
              handleClose();
              menu.sort(menu.value);
            }}
          >
            <Typography variant="body1">{menu.label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </Fragment>
  );
};
