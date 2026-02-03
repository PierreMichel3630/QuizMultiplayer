import { ProtectedRoute } from "./ProtectedRoute";

import AvatarPage from "src/pages/AvatarPage";
import BadgePage from "src/pages/BadgePage";
import BannerPage from "src/pages/BannerPage";
import HelpPage from "src/pages/help/HelpPage";
import InstallationPage from "src/pages/help/InstallationPage";
import NewsPage from "src/pages/NewsPage";
import NotificationsPage from "src/pages/NotificationsPage";
import ParameterPage from "src/pages/ParameterPage";
import ReportPage from "src/pages/ReportPage";
import TitlePage from "src/pages/TitlePage";
import WheelPage from "src/pages/WheelPage";

export const AppNavigationRoutes = [
  {
    path: "/notifications",
    element: (
      <ProtectedRoute>
        <NotificationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/news",
    element: <NewsPage />,
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
    path: "/wheel",
    element: <WheelPage />,
  },
  {
    path: "/help",
    element: <HelpPage />,
  },
  {
    path: "/parameters",
    element: <ParameterPage />,
  },
  {
    path: "/installation",
    element: <InstallationPage />,
  },
  {
    path: "/report",
    element: <ReportPage />,
  },
];
