import AvatarPage from "src/pages/AvatarPage";
import BadgePage from "src/pages/BadgePage";
import BannerPage from "src/pages/BannerPage";
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
  {
    path: "/banner/:id",
    element: <BannerPage />,
  },
  {
    path: "/avatar/:id",
    element: <AvatarPage />,
  },
];
