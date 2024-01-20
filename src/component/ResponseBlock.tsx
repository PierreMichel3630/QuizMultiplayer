import { Paper, Typography } from "@mui/material";
import { percent, px } from "csx";
import { useUser } from "src/context/UserProvider";
import { Response } from "src/models/Response";
import { Colors } from "src/style/Colors";

interface Props {
  response: Response;
}

export const ResponseBlock = ({ response }: Props) => {
  const { language } = useUser();
  const value = response.response[language.iso]
    ? response.response[language.iso]
    : response.response["fr-FR"];

  const label = Array.isArray(value) ? value[0] ?? "" : value;

  return (
    <Paper
      sx={{
        p: 1,
        backgroundColor: Colors.green,
        borderRadius: px(10),
        textAlign: "center",
        width: percent(100),
      }}
    >
      <Typography variant="h2" sx={{ color: "white" }}>
        {label}
      </Typography>
    </Paper>
  );
};
