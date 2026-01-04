import ReactDOM from "react-dom/client";
import "./index.css";

import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

import "@fontsource/bowlby-one-sc/400.css";
import "@fontsource/kalam";

import moment from "moment";
import "moment/dist/locale/fr";
import { HelmetProvider } from "react-helmet-async";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/index.tsx";
import { UserProvider } from "./context/UserProvider.tsx";

moment.locale("fr");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </HelmetProvider>
);
