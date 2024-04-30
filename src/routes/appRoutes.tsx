import { CategoryPage } from "src/pages/CategoryPage";
import { FavoritePage } from "src/pages/FavoritePage";
import { GenerateQuestionPage } from "src/pages/GenerateQuestionPage";
import { NotificationPage } from "src/pages/NotificationPage";
import { ParameterPage } from "src/pages/ParameterPage";
import { PeoplePage } from "src/pages/PeoplePage";
import { PrivateGamePage } from "src/pages/PrivateGamePage";
import { ProfilPage } from "src/pages/ProfilPage";
import { ThemePage } from "src/pages/ThemePage";
import { ThemesPage } from "src/pages/ThemesPage";
import { AdminPage } from "src/pages/admin/AdminPage";
import { ForgotPasswordPage } from "src/pages/connect/ForgotPasswordPage";
import { LoginPage } from "src/pages/connect/LoginPage";
import { RegisterPage } from "src/pages/connect/RegisterPage";
import { ResetPasswordPage } from "src/pages/connect/ResetPasswordPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoutes } from "./adminPage";
import { ConfidentialityPage } from "src/pages/ConfidentialityPage";
import { AccomplishmentPage } from "src/pages/AccomplishmentPage";
import { RankingPage } from "src/pages/RankingPage";
import { PersonalizedPage } from "src/pages/PersonalizedPage";
import { MenuPage } from "src/pages/MenuPage";
import { DiscordPage } from "src/pages/DiscordPage";

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
    children: [...AdminRoutes],
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
    path: "/personalized",
    element: (
      <ProtectedRoute>
        <PersonalizedPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accomplishments",
    element: (
      <ProtectedRoute>
        <AccomplishmentPage />
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
    path: "/ranking",
    element: <RankingPage />,
  },
  {
    path: "/menu",
    element: <MenuPage />,
  },
  {
    path: "/report",
    element: <DiscordPage />,
  },
  {
    path: "/profil/:id",
    element: <ProfilPage />,
  },
  {
    path: "/people",
    element: <PeoplePage />,
  },
  {
    path: "/confidentiality",
    element: <ConfidentialityPage />,
  },
];
