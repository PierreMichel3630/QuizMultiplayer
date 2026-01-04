import { Grid } from "@mui/material";
import { NotificationForm } from "src/form/admin/NotificationForm";

export default function AdminNotificationPage() {
  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12}>
        <NotificationForm />
      </Grid>
    </Grid>
  );
}
