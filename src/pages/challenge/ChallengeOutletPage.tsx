import { Outlet } from "react-router-dom";
import { ChallengeProvider } from "src/context/ChallengeProvider";

export default function ChallengeOutletPage() {
  return (
    <ChallengeProvider>
      <Outlet />
    </ChallengeProvider>
  );
}
