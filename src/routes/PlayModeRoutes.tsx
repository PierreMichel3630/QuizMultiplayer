import ChallengeGamePage from "src/pages/challenge/ChallengeGamePage";
import PlayChallengePage from "src/pages/challenge/PlayChallengePage";
import GameDuelPage from "src/pages/GameDuelPage";
import GameSoloPage from "src/pages/GameSoloPage";
import BattlePage from "src/pages/play/BattlePage";
import DuelPage from "src/pages/play/DuelPage";
import RecapDuelPage from "src/pages/play/RecapDuelPage";
import RecapSoloPage from "src/pages/play/RecapSoloPage";
import SoloPage from "src/pages/play/SoloPage";
import TrainingPage from "src/pages/play/TrainingPage";
import { ProtectedRoute } from "./ProtectedRoute";
import ListPage from "src/pages/modes/list/ListPage";
import ReactionTimePage from "src/pages/modes/braintest/games/ReactionTimePage";
import NumberMemoryPage from "src/pages/modes/braintest/games/NumberMemoryPage";
import SequenceMemoryPage from "src/pages/modes/braintest/games/SequenceMemoryPage";
import AimPage from "src/pages/modes/braintest/games/AimPage";

export const PlayModeRoutes = [
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
    path: "/challenge/game/:uuid",
    element: <ChallengeGamePage />,
  },
  {
    path: "/game/duel/:uuid",
    element: <GameDuelPage />,
  },
  {
    path: "/recapsolo/:uuidGame",
    element: <RecapSoloPage />,
  },
  {
    path: "/recapduel/:uuidGame",
    element: <RecapDuelPage />,
  },
  {
    path: "/list/:id",
    element: <ListPage />,
  },
  // BRAIN TEST
  {
    path: "/gamemode/reactiontime",
    element: <ReactionTimePage />,
  },
  {
    path: "/gamemode/numbermemory",
    element: <NumberMemoryPage />,
  },
  {
    path: "/gamemode/sequencememory",
    element: <SequenceMemoryPage />,
  },
  {
    path: "/gamemode/aimtrainer",
    element: <AimPage />,
  },
];
