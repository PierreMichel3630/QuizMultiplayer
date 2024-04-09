import { Avatar, Box } from "@mui/material";
import { useApp } from "src/context/AppProvider";
import { JsonLanguageBlock } from "./JsonLanguageBlock";
import { px } from "csx";
import { Colors } from "src/style/Colors";

interface Props {
  id: number;
  size?: number;
  color?: string;
}

export const CountryBlock = ({
  id,
  color = "text.primary",
  size = 25,
}: Props) => {
  const { countries } = useApp();
  const country = countries.find((el) => el.id === id);
  return (
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
        <JsonLanguageBlock variant="h6" sx={{ color }} value={country.name} />
      </Box>
    )
  );
};
