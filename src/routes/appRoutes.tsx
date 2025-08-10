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

import OutletPage from "src/pages/OutletPage";
import ParameterPage from "src/pages/ParameterPage";
import PlayPage from "src/pages/PlayPage";
import PreviousThemePage from "src/pages/PreviousThemePage";
import ProposeThemePage from "src/pages/ProposeThemePage";
import StreakPage from "src/pages/StreakPage";
import UpdatedThemePage from "src/pages/UpdatedThemePage";
import WheelPage from "src/pages/WheelPage";
import ChallengeOutletPage from "src/pages/challenge/ChallengeOutletPage";
import ChallengePage from "src/pages/challenge/ChallengePage";
import SharePage from "src/pages/help/SharePage";
import AvatarsPage from "src/pages/shop/AvatarsPage";
import BadgesPage from "src/pages/shop/BadgesPages";
import BannersPage from "src/pages/shop/BannersPage";
import ShopPage from "src/pages/shop/ShopPage";
import ShopThemePage from "src/pages/shop/ShopThemePage";
import TitlesPage from "src/pages/shop/TitlesPage";

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
        path: "/parameters",
        element: <ParameterPage />,
      },
      {
        path: "/share",
        element: <SharePage />,
      },
      {
        path: "/proposetheme",
        element: <ProposeThemePage />,
      },
      {
        path: "/streak",
        element: <StreakPage />,
      },
      {
        path: "/games",
        element: <HistoryGamePage />,
      },
      {
        path: "/config/training/:themeid",
        element: <ConfigTrainingPage />,
      },
      /* SHOP */
      {
        path: "/shop",
        element: <ShopPage />,
      },
      {
        path: "/avatars",
        element: <AvatarsPage />,
      },
      {
        path: "/banners",
        element: <BannersPage />,
      },
      {
        path: "/badges",
        element: <BadgesPage />,
      },
      {
        path: "/titles",
        element: <TitlesPage />,
      },
      {
        path: "/theme/:id/shop",
        element: <ShopThemePage />,
      },
      {
        path: "/challenge",
        element: <ChallengeOutletPage />,
        children: [
          {
            path: "/challenge",
            element: <ChallengePage />,
          },
        ],
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
  {
    path: "/wheel",
    element: <WheelPage />,
  },
];
