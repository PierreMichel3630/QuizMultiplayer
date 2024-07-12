import BadgePage from "src/pages/BadgePage";
import TitlePage from "src/pages/TitlePage";

export const appNoOutletRoutes = [
  {
    path: "/badge/:id",
    element: <BadgePage />,
  },
  {
    path: "/title/:id",
    element: <TitlePage />,
  },
];
