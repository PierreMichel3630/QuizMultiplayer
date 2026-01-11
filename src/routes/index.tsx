import { createBrowserRouter } from "react-router-dom";

import App from "src/App";
import NavigationOutletPage from "src/pages/outlet/NavigationOutletPage";
import NotificationOutlet from "src/pages/outlet/NotificationOutlet";
import { AppNavigationAndAppBarRoutes } from "./AppNavigationAndAppBarRoutes";
import { AppNavigationRoutes } from "./AppNavigationRoutes";
import { DefaultRoutes } from "./DefaultRoutes";
import { PlayModeRoutes } from "./PlayModeRoutes";

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
      ...PlayModeRoutes,
      ...DefaultRoutes,
    ],
  },
]);
