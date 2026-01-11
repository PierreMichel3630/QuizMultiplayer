import ForgotPasswordPage from "src/pages/connect/ForgotPasswordPage";
import LoginPage from "src/pages/connect/LoginPage";
import RegisterPage from "src/pages/connect/RegisterPage";
import HelpPage from "src/pages/help/HelpPage";
import InstallationPage from "src/pages/help/InstallationPage";
import MenuPage from "src/pages/MenuPage";
import ParameterPage from "src/pages/ParameterPage";
import PlayPage from "src/pages/PlayPage";
import ReportPage from "src/pages/ReportPage";
import SearchMobilePage from "src/pages/SearchMobilePage";

export const DefaultRoutes = [
  // Connection
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/forgotpassword",
    element: <ForgotPasswordPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  // Autres
  {
    path: "/menus",
    element: <MenuPage />,
  },
  {
    path: "/help",
    element: <HelpPage />,
  },
  {
    path: "/installation",
    element: <InstallationPage />,
  },
  {
    path: "/report",
    element: <ReportPage />,
  },
  {
    path: "/parameters",
    element: <ParameterPage />,
  },
  {
    path: "/play",
    element: <PlayPage />,
  },
  {
    path: "/searchmobile",
    element: <SearchMobilePage />,
  },
];
