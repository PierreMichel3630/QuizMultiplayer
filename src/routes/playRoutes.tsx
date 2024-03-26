import { DuelPage } from "src/pages/play/DuelPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { SoloPage } from "src/pages/play/SoloPage";

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
];
