import { createBrowserRouter } from "react-router-dom";

import { PlayRoutes } from "./playRoutes";

import App from "src/App";
import NotificationOutlet from "src/pages/outlet/NotificationOutlet";
import { AppNavigationAndAppBarRoutes } from "./AppNavigationAndAppBarRoutes";
import { AppNavigationRoutes } from "./AppNavigationRoutes";
import { ConnectRoutes } from "./connectRoutes";
import NavigationOutletPage from "src/pages/outlet/NavigationOutletPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <NotificationOutlet />,
        children: [
          {
            path: "/",
            element: <NavigationOutletPage />,
            children: [...AppNavigationRoutes, ...AppNavigationAndAppBarRoutes],
          },
        ],
      },
      ...PlayRoutes,
      ...ConnectRoutes,
    ],
  },
]);
