import { Avatar, Box } from "@mui/material";
import { px } from "csx";
import { Country } from "src/models/Country";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

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
      <Avatar
        alt="flag"
        src={country.flag}
        sx={{
          width: px(size),
          height: px(size),
          border: `2px solid ${Colors.white}`,
        }}
      />
      <JsonLanguageBlock variant="body1" sx={{ color }} value={country.name} />
    </Box>
  );
