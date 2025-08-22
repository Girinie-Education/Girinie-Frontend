// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";

// ESM에서 __dirname 대체
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svgr(), react(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api/v1": {
        target: "https://f68416e83316.ngrok-free.app",
        changeOrigin: true,
        secure: true,
        configure: (proxy) => {
          proxy.on("proxyRes", (proxyRes) => {
            const setCookie = proxyRes.headers["set-cookie"];
            if (Array.isArray(setCookie)) {
              proxyRes.headers["set-cookie"] = setCookie.map((cookie) =>
                cookie
                  .replace(/;\s*Domain=[^;]+/i, "; Domain=localhost")
                  .replace(/;\s*Secure/gi, "")
              );
            }
          });
        },
      },
    },
  },
});
