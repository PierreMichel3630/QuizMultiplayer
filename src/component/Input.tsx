import {
  IconButton,
  InputAdornment,
  InputBase,
  InputBaseProps,
  OutlinedInput,
  TextField,
} from "@mui/material";
import { padding, percent, px } from "csx";

import ClearIcon from "@mui/icons-material/Clear";
import { useMemo, useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { Box, BoxProps } from "@mui/system";
import { Colors } from "src/style/Colors";
import { useUser } from "src/context/UserProvider";

interface PropsBaseInput extends InputBaseProps {
  value: string;
  clear: () => void;
}

export const BaseInput = ({ value, clear, ...props }: PropsBaseInput) => {
  return (
    <OutlinedInput
      sx={{ ml: 1, flex: 1 }}
      value={value}
      {...props}
      endAdornment={
        <InputAdornment position="end">
          {value !== "" && (
            <IconButton
              type="button"
              size="small"
              aria-label="clear"
              onClick={() => clear()}
            >
              <ClearIcon sx={{ width: 15, height: 15 }} />
            </IconButton>
          )}
        </InputAdornment>
      }
    />
  );
};

interface PropsBasicSearchInput extends Omit<BoxProps, "onChange" | "onFocus"> {
  label?: string;
  value: string;
  onChange?: (value: string) => void;
  handleSubmit?: () => void;
  clear?: () => void;
  onFocus?: () => void;
  autoFocus?: boolean;
}

export const BasicSearchInput = ({
  label,
  value,
  clear,
  onChange,
  handleSubmit,
  onFocus,
  autoFocus = false,
  ...props
}: PropsBasicSearchInput) => {
  const { mode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);

  return (
    <form
      style={{ width: percent(100) }}
      onSubmit={(event) => {
        event.stopPropagation();
        event.preventDefault();
        if (handleSubmit) handleSubmit();
      }}
    >
      <Box
        sx={{
          ...props.sx,
          display: "flex",
          width: percent(100),
          border: "1px solid",
          borderRadius: px(40),
          borderColor: isDarkMode ? "#303030" : "#d3d3d3",
        }}
      >
        <Box
          sx={{
            borderRadius: "40px 0px 0px 40px",
            p: padding(5, 10, 5, 20),
            width: percent(100),
            display: "flex",
            alignItems: "center",
            backgroundColor: isDarkMode ? "initial" : Colors.white,
          }}
        >
          <InputBase
            sx={{ flex: 1 }}
            placeholder={label ?? ""}
            inputProps={{ "aria-label": label ?? "" }}
            value={value}
            onChange={(event) => {
              if (onChange) {
                onChange(event.target.value);
              }
            }}
            onFocus={onFocus}
            autoFocus={autoFocus}
          />
          {value !== "" && clear && <ClearIcon onClick={() => clear()} />}
        </Box>
        <Box
          sx={{
            backgroundColor: isDarkMode ? "#FFFFFF14" : Colors.grey7,
            width: px(64),
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "0 40px 40px 0",
            cursor: "pointer",
            borderLeft: "1px solid",
            borderColor: isDarkMode ? "#303030" : "#d3d3d3",
          }}
          onClick={() => {
            if (handleSubmit) handleSubmit();
          }}
        >
          <SearchIcon sx={{ fontSize: px(30), color: "text.primary" }} />
        </Box>
      </Box>
    </form>
  );
};

interface PropsInputEnter {
  label: string;
  onChange: (value: string) => void;
}

export const InputEnter = ({ onChange, label }: PropsInputEnter) => {
  const [value, setValue] = useState("");

  return (
    <TextField
      value={value}
      fullWidth
      onChange={(event) => setValue(event.target.value)}
      label={label}
      onKeyPress={(ev) => {
        if (ev.key === "Enter") {
          onChange(value);
          setValue("");
          ev.preventDefault();
        }
      }}
    />
  );
};
