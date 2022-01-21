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
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {
        manualChunks: {
          wallet: [
            "./src/views/MyNFTs.vue",
            "./src/views/NFTWalletView.vue",
            "./src/views/Wallet.vue",
          ],
          shared: [
            "./src/views/Shared.vue",
            "./src/views/SharedNFTs.vue",
            "./src/views/NFTSharedDetail.vue",
            "./src/views/NFTSharedView.vue",
          ],
          help: ["./src/views/Help.vue"],
        },
      },
    },
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
