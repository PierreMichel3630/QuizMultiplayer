import { Grid, Typography } from "@mui/material";
import { important, px } from "csx";
import { JsonLanguage } from "src/models/Language";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "../JsonLanguageBlock";
import { GoBackButtonIcon } from "../navigation/GoBackButton";

import StarIcon from "@mui/icons-material/Star";
import StarBorderOutlinedIcon from "@mui/icons-material/StarBorderOutlined";

interface Props {
  title: JsonLanguage | string;
  favorite?: boolean;
  addFavorite?: () => void;
}

export const TitleBlock = ({ title, favorite = false, addFavorite }: Props) => {
  return (
    <Grid
      container
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
    >
      <Grid item>
        <GoBackButtonIcon />
      </Grid>
      <Grid item xs sx={{ textAlign: "center" }}>
        {typeof title === "string" ? (
          <Typography
            variant="h2"
            color="text.secondary"
            sx={{ fontSize: important(px(25)) }}
          >
            {title}
          </Typography>
        ) : (
          <JsonLanguageBlock
            variant="h2"
            color="text.secondary"
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
                fontSize: 45,
                color: Colors.yellow4,
                cursor: "pointer",
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
