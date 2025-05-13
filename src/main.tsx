import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import "@fontsource/montserrat/300.css";
import "@fontsource/montserrat/400.css";
import "@fontsource/montserrat/500.css";
import "@fontsource/montserrat/700.css";

import "@fontsource/bowlby-one-sc/400.css";
import "@fontsource/kalam";

import { HelmetProvider } from "react-helmet-async";
import moment from "moment";
import "moment/dist/locale/fr";

moment.locale("fr");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
