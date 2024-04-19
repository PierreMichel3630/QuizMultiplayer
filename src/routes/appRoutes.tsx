import { AdminPage } from "src/pages/AdminPage";
import { GenerateQuestionPage } from "src/pages/GenerateQuestionPage";
import { NotificationPage } from "src/pages/NotificationPage";
import { ParameterPage } from "src/pages/ParameterPage";
import { PeoplePage } from "src/pages/PeoplePage";
import { PrivateGamePage } from "src/pages/PrivateGamePage";
import { ProfilPage } from "src/pages/ProfilPage";
import { ThemePage } from "src/pages/ThemePage";
import { ThemesPage } from "src/pages/ThemesPage";
import { ForgotPasswordPage } from "src/pages/connect/ForgotPasswordPage";
import { LoginPage } from "src/pages/connect/LoginPage";
import { RegisterPage } from "src/pages/connect/RegisterPage";
import { ResetPasswordPage } from "src/pages/connect/ResetPasswordPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { CategoryPage } from "src/pages/CategoryPage";
import { FavoritePage } from "src/pages/FavoritePage";

export const AppRoutes = [
  {
    path: "/",
    element: <ThemesPage />,
  },
  {
    path: "/favorite",
    element: <FavoritePage />,
  },
  {
    path: "/category/:id",
    element: <CategoryPage />,
  },
  {
    path: "/theme/:id",
    element: <ThemePage />,
  },
  {
    path: "/privategame/:id",
    element: <PrivateGamePage />,
  },
  {
    path: "/administration",
    element: (
      <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    ),
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
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <NotificationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profil/:id",
    element: <ProfilPage />,
  },
  {
    path: "/people",
    element: <PeoplePage />,
  },
];
