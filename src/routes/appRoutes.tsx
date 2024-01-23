import { AdminPage } from "src/pages/AdminPage";
import { ThemePage } from "src/pages/ThemePage";
import { PlayPage } from "../pages/PlayPage";

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
    path: "/admine",
    element: <AdminPage />,
  },
];
