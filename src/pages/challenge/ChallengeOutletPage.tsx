import { Container } from "@mui/material";
import { Outlet } from "react-router-dom";
import { ChallengeProvider } from "src/context/ChallengeProvider";

export default function ChallengeOutletPage() {
  return (
    <Container
      maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        p: 0,
      }}
      className="page"
    >
      <ChallengeProvider>
        <Outlet />
      </ChallengeProvider>
    </Container>
  );
}
