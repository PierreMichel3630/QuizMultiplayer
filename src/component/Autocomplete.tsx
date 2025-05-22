import ClearIcon from "@mui/icons-material/Clear";
import { IconButton, InputBase, Paper } from "@mui/material";
import { percent, px } from "csx";
import { useEffect, useRef, useState } from "react";
import { ICardImage } from "./card/CardImage";
import { ThemeListScrollBlock } from "./scroll/ThemeScroll";

interface PropsAutocompleteInput {
  placeholder: string;
  onSelect: (value: ICardImage) => void;
}

export const AutocompleteInputTheme = ({
  placeholder,
  onSelect,
}: PropsAutocompleteInput) => {
  const [search, setSearch] = useState("");
  const [focused, setFocused] = useState(false);
  const onFocus = () => setFocused(true);
  const unFocus = () => setFocused(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const refOptions = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        unFocus();
      }
    };
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  return (
    <div style={{ position: "relative" }} ref={ref}>
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
          placeholder={placeholder}
          inputProps={{ "aria-label": placeholder }}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          onFocus={onFocus}
        />
        {search !== "" && (
          <IconButton
            type="button"
            size="small"
            aria-label="clear"
            onClick={() => setSearch("")}
          >
            <ClearIcon sx={{ width: 15, height: 15 }} />
          </IconButton>
        )}
      </Paper>
      <Paper
        variant="outlined"
        sx={{
          display: focused ? "flex" : "none",
          alignItems: "center",
          width: percent(100),
          zIndex: 2,
          flexDirection: "column",
          position: "absolute",
          maxHeight: px(200),
          overflow: "scroll",
        }}
        ref={refOptions}
      >
        <ThemeListScrollBlock
          search={search}
          onSelect={(value) => {
            setSearch("");
            onSelect(value);
            unFocus();
          }}
        />
      </Paper>
    </div>
  );
};
