import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vite.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api/v1": {
        target: "https://e6da10b0b3fc.ngrok-free.app",
        changeOrigin: true,
        secure: true,
        // keep path as-is (/api/v1/...)
        // rewrite: (p) => p,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const setCookie = proxyRes.headers["set-cookie"];
            if (Array.isArray(setCookie)) {
              proxyRes.headers["set-cookie"] = setCookie.map((cookie) =>
                cookie
                  // force cookie for localhost so the browser stores it on dev origin
                  .replace(/;\s*Domain=[^;]+/i, "; Domain=localhost")
                  // allow http dev server to store cookies
                  .replace(/;\s*Secure/gi, "")
              );
            }
          });
        },
      },
    },
  },
});
