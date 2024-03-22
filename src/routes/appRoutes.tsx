import { AdminPage } from "src/pages/AdminPage";
import { FriendPage } from "src/pages/FriendPage";
import { ParameterPage } from "src/pages/ParameterPage";
import { PrivateGamePage } from "src/pages/PrivateGamePage";
import { ThemesPage } from "src/pages/ThemesPage";
import { ForgotPasswordPage } from "src/pages/connect/ForgotPasswordPage";
import { LoginPage } from "src/pages/connect/LoginPage";
import { RegisterPage } from "src/pages/connect/RegisterPage";
import { ResetPasswordPage } from "src/pages/connect/ResetPasswordPage";
import { SoloPage } from "src/pages/play/SoloPage";
import { PlayPage } from "../pages/PlayPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { GenerateQuestionPage } from "src/pages/GenerateQuestionPage";
import { StatisticsPage } from "src/pages/StatisticsPage";
import { DuelPage } from "src/pages/play/DuelPage";
import { ThemePage } from "src/pages/ThemePage";

export const AppRoutes = [
  {
    path: "/",
    element: <ThemesPage />,
  },
  {
    path: "/theme/:id",
    element: <ThemePage />,
  },
  {
    path: "/solo/:themeid",
    element: <SoloPage />,
  },
  {
    path: "/duel/:id",
    element: <DuelPage />,
  },
  {
    path: "/play/:channelid",
    element: <PlayPage />,
  },
  {
    path: "/privategame/:id",
    element: <PrivateGamePage />,
  },
  {
    path: "/admine",
    element: <AdminPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/generate",
    element: <GenerateQuestionPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/resetpassword",
    element: <ResetPasswordPage />,
  },
  {
    path: "/parameter",
    element: (
      <ProtectedRoute>
        <ParameterPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/friends",
    element: (
      <ProtectedRoute>
        <FriendPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/statistics",
    element: (
      <ProtectedRoute>
        <StatisticsPage />
      </ProtectedRoute>
    ),
  },
];
