import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";
import { injectHtml } from "vite-plugin-html";

const xummSandbox = process.env.VITE_XUMM_SANDOX;

const remoteScript =
  xummSandbox === "test"
    ? '<script data-consolejs-channel="0dc99d93-4c6b-6c36-8f48-e404d46bb556" src="https://remotejs.com/agent/agent.js"></script>'
    : null;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({}),
    injectHtml({
      data: {
        title: "Peerkat",
        injectScript: remoteScript,
      },
    }),
  ],
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
