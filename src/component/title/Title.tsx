import { Box, Grid, Typography, TypographyVariant } from "@mui/material";
import { px } from "csx";
import { Colors } from "src/style/Colors";
import { GoBackButtonIcon } from "../navigation/GoBackButton";

import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { useMemo } from "react";
import { useUser } from "src/context/UserProvider";
import { TitleProfile } from "src/models/Title";
import { TextNameBlock } from "../language/TextLanguageBlock";

interface Props {
  title: JSX.Element | string;
  favorite?: boolean;
  addFavorite?: () => void;
  link?: string;
}

export const TitleBlock = ({
  title,
  favorite = false,
  addFavorite,
  link,
}: Props) => {
  const { mode } = useUser();

  const isDarkMode = useMemo(() => mode === "dark", [mode]);
  const colorBorderFavorite = useMemo(
    () => (isDarkMode ? Colors.yellow4 : Colors.black),
    [isDarkMode]
  );

  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid>
        <GoBackButtonIcon link={link} />
      </Grid>
      <Grid sx={{ textAlign: "center" }} size="grow">
        {typeof title === "string" ? (
          <Typography variant="h2">{title}</Typography>
        ) : (
          title
        )}
      </Grid>
      {addFavorite && (
        <Grid sx={{ minWidth: px(60) }}>
          {favorite ? (
            <StarIcon
              sx={{
                fontSize: 45,
                color: Colors.yellow4,
                cursor: "pointer",
                stroke: colorBorderFavorite,
              }}
              onClick={() => addFavorite()}
            />
          ) : (
            <StarBorderOutlinedIcon
              sx={{
                fontSize: 45,
                color: Colors.yellow4,
                cursor: "pointer",
              }}
              onClick={() => addFavorite()}
            />
          )}
        </Grid>
      )}
    </Grid>
  );
};

interface TitleTextProps {
  value: TitleProfile;
  variant?: TypographyVariant;
  color?: string;
}
export const TitleText = ({
  value,
  variant = "caption",
  color = "text.primary",
}: TitleTextProps) => {
  return (
    <Box>
      {value.title.ismultiple && value.multiplicator !== null && (
        <Typography variant={variant} component="span" color={color}>
          {value.multiplicator} x{" "}
        </Typography>
      )}
      <TextNameBlock
        color={color}
        component="span"
        variant={variant}
        values={value.title.titletranslation}
      />
    </Box>
  );
};
