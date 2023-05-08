import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
// import { VitePWA } from "vite-plugin-pwa";
import { injectHtml } from "vite-plugin-html";
const hash = Math.floor(Math.random() * 90000) + 10000;
const xummSandbox = process.env.VITE_XUMM_SANDBOX;

const remoteScript =
  xummSandbox !== "mainwe"
    ? '<script data-consolejs-channel="0dc99d93-4c6b-6c36-8f48-e404d46bb556" src="https://remotejs.com/agent/agent.js"></script>'
    : null;
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    // VitePWA({}),
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
    target: ["es2020"],
    rollupOptions: {
      output: {
        entryFileNames: `[name]` + hash + `.js`,
        chunkFileNames: `[name]` + hash + `.js`,
        assetFileNames: `[name]` + hash + `.[ext]`,
        manualChunks: {
          welcome: ["./src/views/Welcome.vue"],
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
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "/src"),
    },
  },
  server: {
    proxy: {
      "/apidev": {
        target: "https://d2gdfyavin91j3.cloudfront.net",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/apidev/, ""),
      },
      "/logger": {
        target:
          "https://17asvselri.execute-api.eu-west-2.amazonaws.com/Prod/log",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/logger/, ""),
      },
    },
  },
});
