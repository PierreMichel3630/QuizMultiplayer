import { Box, Grid } from "@mui/material";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";

import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import { percent, px } from "csx";
import { Title } from "src/models/Title";
import { Colors } from "src/style/Colors";
import { JsonLanguageBlock } from "./JsonLanguageBlock";

interface Props {
  onSelect: (value: Title) => void;
}

export const TitleSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { myTitles } = useApp();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          {myTitles.map((title) => {
            const isSelect =
              profile && profile.title && profile.title.id === title.id;

            return (
              <Grid item xs={12} sm={6} key={title.id}>
                <Box sx={{ position: "relative", textAlign: "center" }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      p: px(3),
                      backgroundColor: Colors.blue3,
                      borderRadius: px(5),
                    }}
                    onClick={() => onSelect(title)}
                  >
                    <JsonLanguageBlock
                      variant="h6"
                      color="text.secondary"
                      value={title.name}
                    />
                    {isSelect && (
                      <CheckCircleTwoToneIcon
                        sx={{
                          color: Colors.green2,
                          backgroundColor: "white",
                          borderRadius: percent(50),
                          zIndex: 2,
                        }}
                      />
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
