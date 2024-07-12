import { ProtectedRoute } from "./ProtectedRoute";

import GameDuelPage from "src/pages/GameDuelPage";
import GameSoloPage from "src/pages/GameSoloPage";
import PlayPage from "src/pages/PlayPage";
import BattlePage from "src/pages/play/BattlePage";
import DuelPage from "src/pages/play/DuelPage";
import RecapDuelPage from "src/pages/play/RecapDuelPage";
import RecapSoloPage from "src/pages/play/RecapSoloPage";
import SoloPage from "src/pages/play/SoloPage";
import TrainingPage from "src/pages/play/TrainingPage";

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
    path: "/solo/:uuidGame",
    element: <SoloPage />,
  },
  {
    path: "/recapsolo/:uuidGame",
    element: <RecapSoloPage />,
  },
  {
    path: "/play",
    element: <PlayPage />,
  },
  {
    path: "/recapduel/:uuidGame",
    element: <RecapDuelPage />,
  },
  {
    path: "/training/:uuidGame",
    element: <TrainingPage />,
  },
  {
    path: "/battle/:uuidGame",
    element: <BattlePage />,
  },
  {
    path: "/game/solo/:uuid",
    element: <GameSoloPage />,
  },
  {
    path: "/game/duel/:uuid",
    element: <GameDuelPage />,
  },
];
