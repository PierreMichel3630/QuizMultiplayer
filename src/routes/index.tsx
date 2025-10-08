import { createBrowserRouter } from "react-router-dom";

import { appNoOutletRoutes } from "./appNoOutletRoutes";
import { AppRoutes } from "./appRoutes";
import { PlayRoutes } from "./playRoutes";

import GameOutlet from "src/pages/GameOutlet";
import App from "src/App";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <GameOutlet />,
        children: [...AppRoutes, ...appNoOutletRoutes],
      },
      ...PlayRoutes,
    ],
  },
]);
