import PlayChallengePage from "src/pages/challenge/PlayChallengePage";
import { ProtectedRoute } from "./ProtectedRoute";

import GameDuelPage from "src/pages/GameDuelPage";
import GameSoloPage from "src/pages/GameSoloPage";
import BattlePage from "src/pages/play/BattlePage";
import DuelPage from "src/pages/play/DuelPage";
import SoloPage from "src/pages/play/SoloPage";
import TrainingPage from "src/pages/play/TrainingPage";
import YtShortPage from "src/pages/play/YtShortPage";
import ChallengeGamePage from "src/pages/challenge/ChallengeGamePage";

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
    path: "/challenge/:uuidGame",
    element: (
      <ProtectedRoute>
        <PlayChallengePage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ytshort/:uuidGame",
    element: <YtShortPage />,
  },
  {
    path: "/solo/:uuidGame",
    element: <SoloPage />,
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
    path: "/game/challenge/:uuid",
    element: <ChallengeGamePage />,
  },
  {
    path: "/game/duel/:uuid",
    element: <GameDuelPage />,
  },
];
