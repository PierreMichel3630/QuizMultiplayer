import { PlayPage } from "src/pages/PlayPage";
import { DuelPage } from "src/pages/play/DuelPage";
import { SoloPage } from "src/pages/play/SoloPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RecapDuelPage } from "src/pages/play/RecapDuelPage";

export const PlayRoutes = [
  {
    path: "/duel/:uuidGame",
    element: (
      <ProtectedRoute>
        <DuelPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/solo/:themeid",
    element: <SoloPage />,
  },
  {
    path: "/play",
    element: <PlayPage />,
  },
  {
    path: "/recapduel",
    element: <RecapDuelPage />,
  },
];
