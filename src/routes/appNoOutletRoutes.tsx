import AvatarPage from "src/pages/AvatarPage";
import BadgePage from "src/pages/BadgePage";
import BannerPage from "src/pages/BannerPage";
import TitlePage from "src/pages/TitlePage";
import RecapDuelPage from "src/pages/play/RecapDuelPage";
import RecapSoloPage from "src/pages/play/RecapSoloPage";

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
  {
    path: "/recapsolo/:uuidGame",
    element: <RecapSoloPage />,
  },
  {
    path: "/recapduel/:uuidGame",
    element: <RecapDuelPage />,
  },
];
