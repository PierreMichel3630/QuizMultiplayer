import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";

export default function DefaultRouteOutletPage() {
  return (
    <Container maxWidth="md">
      <Outlet />
    </Container>
  );
}
