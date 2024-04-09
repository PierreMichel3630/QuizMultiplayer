import { useRoutes } from "react-router-dom";
import { AppRoutes } from "./appRoutes";
import { OutletPage } from "src/pages/OutletPage";
import { PlayRoutes } from "./playRoutes";
export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <OutletPage />,
    children: [...AppRoutes],
  };

  return useRoutes([HomeRoute, ...PlayRoutes]);
}
