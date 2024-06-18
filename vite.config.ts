import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  registerType: "autoUpdate",
  includeAssets: ["**/*"],
  injectManifest: {
    globPatterns: ["**/*"],
  },
  workbox: {
    globPatterns: ["**/*", ".well-known/assetlinks.json"],
    runtimeCaching: [
      {
        urlPattern:
          /^https:\/\/cperjgnbmoqyyqgkyqws\.supabase\.co\/storage\/.*/i,
        handler: "CacheFirst",
        options: {
          cacheName: "supabase-image",
          expiration: {
            maxAgeSeconds: 60 * 60 * 24 * 5,
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  manifest: {
    name: "QuizBattle",
    short_name: "QuizBattle",
    description: "Multitheme quiz with solo mode and ranked",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#01b5da",
    background_color: "#01b5da",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "any",
  },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA(manifestForPlugIn)],
  resolve: {
    alias: {
      src: "/src",
    },
  },
});
