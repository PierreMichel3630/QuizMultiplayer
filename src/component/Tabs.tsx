import { Paper, Tab, Tabs, Typography } from "@mui/material";
import { padding, percent, px } from "csx";
import { Link } from "react-router-dom";

interface Props {
  values: Array<string>;
  onChange: (index: number) => void;
  tab: number;
}

export const DefaultTabs = ({ tab, onChange, values }: Props) => {
  return (
    <Paper
      sx={{
        bgcolor: "rgba(255,255,255,.15)",
        width: percent(100),
        borderBottomLeftRadius: px(0),
        borderBottomRightRadius: px(0),
      }}
    >
      <Tabs
        value={tab}
        onChange={(_event: React.SyntheticEvent, newValue: number) =>
          onChange(newValue)
        }
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        sx={{ minHeight: "auto" }}
      >
        {values.map((value) => (
          <Tab
            key={value}
            sx={{ p: padding(8, 5), minHeight: "auto" }}
            label={
              <Typography
                variant="h6"
                sx={{
                  textTransform: "uppercase",
                }}
              >
                {value}
              </Typography>
            }
          />
        ))}
      </Tabs>
    </Paper>
  );
};

interface PropsLink {
  values: Array<{ label: string; link: string }>;
  onChange: (index: number) => void;
  tab: number;
}

export const DefaultTabsLink = ({ tab, onChange, values }: PropsLink) => {
  return (
    <Paper
      sx={{
        bgcolor: "rgba(255,255,255,.15)",
        width: percent(100),
        borderBottomLeftRadius: px(0),
        borderBottomRightRadius: px(0),
      }}
    >
      <Tabs
        value={tab}
        onChange={(_event: React.SyntheticEvent, newValue: number) =>
          onChange(newValue)
        }
        indicatorColor="secondary"
        textColor="inherit"
        variant="fullWidth"
        sx={{ minHeight: "auto" }}
      >
        {values.map((value, index) => (
          <Tab
            key={index}
            sx={{ p: padding(8, 5), minHeight: "auto" }}
            component={Link}
            to={value.link}
            label={
              <Typography
                variant="h6"
                sx={{
                  textTransform: "uppercase",
                }}
              >
                {value.label}
              </Typography>
            }
          />
        ))}
      </Tabs>
    </Paper>
  );
};
