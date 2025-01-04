import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoutes } from "./adminPage";

import AccomplishmentPage from "src/pages/AccomplishmentPage";
import CategoriesPage from "src/pages/CategoriesPage";
import CategoryPage from "src/pages/CategoryPage";
import ComparePage from "src/pages/ComparePage";
import ConfidentialityPage from "src/pages/ConfidentialityPage";
import FavoritePage from "src/pages/FavoritePage";
import HistoryGamePage from "src/pages/HistoryGamePage";
import ImprovePage from "src/pages/ImprovePage";
import MenuPage from "src/pages/MenuPage";
import NewThemePage from "src/pages/NewThemePage";
import ParameterPage from "src/pages/ParameterPage";
import PeoplePage from "src/pages/PeoplePage";
import PersonalizedPage from "src/pages/PersonalizedPage";
import ProfilPage from "src/pages/ProfilPage";
import RankingPage from "src/pages/RankingPage";
import ReportPage from "src/pages/ReportPage";
import ThemePage from "src/pages/ThemePage";
import ThemesPage from "src/pages/ThemesPage";
import AdminPage from "src/pages/admin/AdminPage";
import ForgotPasswordPage from "src/pages/connect/ForgotPasswordPage";
import LoginPage from "src/pages/connect/LoginPage";
import RegisterPage from "src/pages/connect/RegisterPage";
import ResetPasswordPage from "src/pages/connect/ResetPasswordPage";
import FAQPage from "src/pages/help/FAQPage";
import HelpPage from "src/pages/help/HelpPage";
import InstallationPage from "src/pages/help/InstallationPage";
import ConfigTrainingPage from "src/pages/play/ConfigTrainingPage";

import AvatarPage from "src/pages/AvatarPage";
import BadgePage from "src/pages/BadgePage";
import BannerPage from "src/pages/BannerPage";
import TitlePage from "src/pages/TitlePage";

import MyProfilPage from "src/pages/MyProfilPage";
import OutletPage from "src/pages/OutletPage";
import PlayPage from "src/pages/PlayPage";
import PreviousThemePage from "src/pages/PreviousThemePage";
import UpdatedThemePage from "src/pages/UpdatedThemePage";

export const AppRoutes = [
  {
    path: "/",
    element: <OutletPage />,
    children: [
      {
        path: "/",
        element: <ThemesPage />,
      },
      {
        path: "/favorite",
        element: <FavoritePage />,
      },
      {
        path: "/previousgame",
        element: <PreviousThemePage />,
      },
      {
        path: "/new",
        element: <NewThemePage />,
      },
      {
        path: "/updated",
        element: <UpdatedThemePage />,
      },
      {
        path: "/categories",
        element: <CategoriesPage />,
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
        path: "/administration",
        element: (
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        ),
        children: [...AdminRoutes],
      },
      {
        path: "/resetpassword",
        element: <ResetPasswordPage />,
      },
      {
        path: "/parameter",
        element: <ParameterPage />,
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
        element: <AccomplishmentPage />,
      },
      {
        path: "/compare",
        element: (
          <ProtectedRoute>
            <ComparePage />
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
        element: <ReportPage />,
      },
      {
        path: "/myprofile",
        element: (
          <ProtectedRoute>
            <MyProfilPage />
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
      {
        path: "/confidentiality",
        element: <ConfidentialityPage />,
      },
      {
        path: "/help",
        element: <HelpPage />,
      },
      {
        path: "/faq",
        element: <FAQPage />,
      },
      {
        path: "/installation",
        element: <InstallationPage />,
      },
      {
        path: "/improve",
        element: <ImprovePage />,
      },
      {
        path: "/games",
        element: <HistoryGamePage />,
      },
      {
        path: "/config/training/:themeid",
        element: <ConfigTrainingPage />,
      },
    ],
  },
  /*NO HEADER*/
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/badge/:id",
    element: <BadgePage />,
  },
  {
    path: "/title/:id",
    element: <TitlePage />,
  },
  {
    path: "/banner/:id",
    element: <BannerPage />,
  },
  {
    path: "/avatar/:id",
    element: <AvatarPage />,
  },
  {
    path: "/play",
    element: <PlayPage />,
  },
];
