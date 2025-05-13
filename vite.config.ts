import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA, VitePWAOptions } from "vite-plugin-pwa";

const manifestForPlugIn: Partial<VitePWAOptions> = {
  includeAssets: ["**/*"],
  injectManifest: {
    globPatterns: ["**/*"],
  },
  registerType: "prompt",
  workbox: {
    sourcemap: true,
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
        src: "/pwa/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: "#01b5db",
    background_color: "#01b5da",
    display: "standalone",
    scope: "/",
    start_url: "/",
    orientation: "portrait",
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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
});
