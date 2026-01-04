import { Box, Grid } from "@mui/material";
import { useApp } from "src/context/AppProvider";
import { useAuth } from "src/context/AuthProviderSupabase";

import { TitleProfile } from "src/models/Title";
import { BadgeTitleProfile } from "./Badge";

interface Props {
  onSelect: (value: TitleProfile) => void;
}

export const TitleSelector = ({ onSelect }: Props) => {
  const { profile } = useAuth();
  const { myTitles } = useApp();

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Grid container spacing={1} alignItems="center">
          {myTitles.map((title) => {
            const isSelect = profile?.titleprofile?.id === title.id;

            return (
              <Grid item xs={12} sm={6} key={title.id}>
                <Box sx={{ position: "relative", textAlign: "center" }}>
                  <BadgeTitleProfile
                    title={title}
                    isSelect={isSelect}
                    onClick={() => onSelect(title)}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </Grid>
  );
};
