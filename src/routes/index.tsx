import { useRoutes } from "react-router-dom";
import { AppRoutes } from "./appRoutes";
import { HomePage } from "src/pages/HomePage";
import { PlayRoutes } from "./playRoutes";
export default function ThemeRoutes() {
  const HomeRoute = {
    path: "/",
    element: <HomePage />,
    children: [...AppRoutes],
  };

  return useRoutes([HomeRoute, ...PlayRoutes]);
}
