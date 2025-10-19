import { Avatar, Box, Grid, Typography } from "@mui/material";
import { percent } from "csx";

import { Colors } from "src/style/Colors";

interface Rule {
  label: string;
  extra?: JSX.Element;
}
interface Props {
  rules: Array<Rule>;
}
export const RuleBlock = ({ rules }: Props) => {
  return (
    <Grid container spacing={1}>
      {rules.map((rule, index) => (
        <Grid item xs={12} key={index}>
          <Box
            sx={{
              p: 1,
              display: "flex",
              alignItems: "center",
              gap: 1,
              width: percent(100),
              borderRadius: 2,
              height: percent(100),
              backgroundColor: Colors.black,
            }}
          >
            <Avatar
              sx={{ width: 30, height: 30, backgroundColor: Colors.white }}
            >
              <Typography variant="h4" sx={{ color: Colors.black }}>
                {index + 1}
              </Typography>
            </Avatar>
            <Box
              sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 1 }}
            >
              <Typography variant="h6" color="text.secondary">
                {rule.label}
              </Typography>
              {rule.extra && <>{rule.extra}</>}
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};
