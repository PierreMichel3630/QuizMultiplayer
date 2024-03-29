import { IconButton, InputBase, Paper } from "@mui/material";
import { percent } from "csx";

import ClearIcon from "@mui/icons-material/Clear";

interface PropsBaseInput {
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

export const BaseInput = ({ value, clear, onChange }: PropsBaseInput) => {
  return (
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
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
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
    </Paper>
  );
};

interface PropsBasicSearchInput {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  clear: () => void;
}

export const BasicSearchInput = ({
  label,
  value,
  clear,
  onChange,
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
    />
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
  </Paper>
);
