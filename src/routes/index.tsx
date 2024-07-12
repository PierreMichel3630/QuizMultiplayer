import { useRoutes } from "react-router-dom";

import { appNoOutletRoutes } from "./appNoOutletRoutes";
import { AppRoutes } from "./appRoutes";
import { PlayRoutes } from "./playRoutes";

import OutletPage from "src/pages/OutletPage";

export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <OutletPage />,
    children: [...AppRoutes],
  };

  return useRoutes([HomeRoute, ...PlayRoutes, ...appNoOutletRoutes]);
}
