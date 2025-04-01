import {
  Divider,
  IconButton,
  InputAdornment,
  InputBase,
  InputBaseProps,
  OutlinedInput,
  Paper,
  TextField,
} from "@mui/material";
import { percent } from "csx";

import ClearIcon from "@mui/icons-material/Clear";
import { useState } from "react";

import SearchIcon from "@mui/icons-material/Search";
import { Colors } from "src/style/Colors";

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

interface PropsBasicSearchInput {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  clear?: () => void;
  onFocus?: () => void;
}

export const BasicSearchInput = ({
  label,
  value,
  clear,
  onChange,
  onFocus,
}: PropsBasicSearchInput) => (
  <Paper
    variant="outlined"
    sx={{
      p: "2px 4px",
      display: "flex",
      alignItems: "center",
      width: percent(100),
    }}
  >
    <InputBase
      sx={{ ml: 1, flex: 1 }}
      placeholder={label ?? ""}
      inputProps={{ "aria-label": label ?? "" }}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onFocus={onFocus}
    />
    <SearchIcon fontSize="large" sx={{ color: Colors.grey4 }} />
    {value !== "" && clear && (
      <>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
        <IconButton
          type="button"
          size="small"
          aria-label="clear"
          onClick={() => clear()}
        >
          <ClearIcon sx={{ width: 15, height: 15 }} />
        </IconButton>
      </>
    )}
  </Paper>
);

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
