import { ProtectedRoute } from "./ProtectedRoute";

import AvatarPage from "src/pages/AvatarPage";
import BadgePage from "src/pages/BadgePage";
import BannerPage from "src/pages/BannerPage";
import NewsPage from "src/pages/NewsPage";
import NotificationsPage from "src/pages/NotificationsPage";
import ParameterPage from "src/pages/ParameterPage";
import PlayPage from "src/pages/PlayPage";
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
    path: "/parameters",
    element: <ParameterPage />,
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
    path: "/play",
    element: <PlayPage />,
  },
  {
    path: "/wheel",
    element: <WheelPage />,
  },
];
