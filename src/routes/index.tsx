import { useRoutes } from "react-router-dom";

import { appNoOutletRoutes } from "./appNoOutletRoutes";
import { AppRoutes } from "./appRoutes";
import { PlayRoutes } from "./playRoutes";

import GameOutlet from "src/pages/GameOutlet";

export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <GameOutlet />,
    children: [...AppRoutes, ...appNoOutletRoutes],
  };

  return useRoutes([HomeRoute, ...PlayRoutes]);
}
