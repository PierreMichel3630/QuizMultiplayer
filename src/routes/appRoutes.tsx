import { ThemePage } from "src/pages/ThemePage";
import { PlayPage } from "../pages/PlayPage";
import { AdminPage } from "src/pages/AdminPage";

export const AppRoutes = [
  {
    path: "/",
    element: <ThemePage />,
  },
  {
    path: "/play/:id",
    element: <PlayPage />,
  },
  {
    path: "/admin",
    element: <AdminPage />,
  },
];
