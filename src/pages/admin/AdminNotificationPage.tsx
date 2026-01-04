import { Grid } from "@mui/material";
import { NotificationForm } from "src/form/admin/NotificationForm";

export default function AdminNotificationPage() {
  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid size={12}>
        <NotificationForm />
      </Grid>
    </Grid>
  );
}
