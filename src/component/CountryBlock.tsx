import { Box } from "@mui/material";
import { Country } from "src/models/Country";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { percent } from "csx";

interface Props {
  country: Country;
  size?: number;
  color?: string;
}

export const CountryBlock = ({
  country,
  color = "text.primary",
  size = 25,
}: Props) =>
  country && (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
      }}
    >
      <CountryImageBlock country={country} size={size} />
      <JsonLanguageBlock
        variant="body1"
        sx={{
          color: color,
          overflow: "hidden",
          display: "block",
          lineClamp: 1,
          boxOrient: "vertical",
          textOverflow: "ellipsis",
          textShadow: "1px 1px 2px black",
        }}
        noWrap
        value={country.name}
      />
    </Box>
  );

interface CountryImageBlockProps {
  country: Country;
  size?: number;
}
export const CountryImageBlock = ({
  country,
  size = 25,
}: CountryImageBlockProps) =>
  country && (
    <Box
      sx={{ display: "flex", alignItems: "center", width: size, height: size }}
    >
      <img
        alt="flag"
        src={country.flag}
        style={{
          maxWidth: percent(100),
          maxHeight: percent(100),
          border: "1px solid white",
        }}
      />
    </Box>
  );
