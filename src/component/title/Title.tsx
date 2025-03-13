import { Grid, Typography } from "@mui/material";
import { important, px } from "csx";
import { JsonLanguage } from "src/models/Language";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { GoBackButtonIcon } from "../navigation/GoBackButton";

import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";
import { useUser } from "src/context/UserProvider";
import { useMemo } from "react";

interface Props {
  title: JsonLanguage | string;
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
      <Grid item>
        <GoBackButtonIcon link={link} />
      </Grid>
      <Grid item xs sx={{ textAlign: "center" }}>
        {typeof title === "string" ? (
          <Typography variant="h2" sx={{ fontSize: important(px(25)) }}>
            {title}
          </Typography>
        ) : (
          <JsonLanguageBlock
            variant="h2"
            sx={{ fontSize: important(px(25)) }}
            value={title}
          />
        )}
      </Grid>
      {addFavorite && (
        <Grid item sx={{ minWidth: px(60) }}>
          {favorite ? (
            <StarIcon
              sx={{
                fontSize: 50,
                color: Colors.yellow4,
                cursor: "pointer",
                stroke: colorBorderFavorite,
              }}
              onClick={() => addFavorite()}
            />
          ) : (
            <StarBorderOutlinedIcon
              sx={{
                fontSize: 50,
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
