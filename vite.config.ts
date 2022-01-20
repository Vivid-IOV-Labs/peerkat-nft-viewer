import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VitePWA({})],
  optimizeDeps: {
    include: ["axe-core"],
  },
  server: {
    proxy: {
      __getcookie: {
        target: "http://localhost:1337",
        ws: true,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
});
