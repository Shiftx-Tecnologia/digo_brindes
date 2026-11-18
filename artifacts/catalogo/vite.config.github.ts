import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { fileURLToPath } from "url";

// "base" deve ser o nome do repositório no GitHub (GitHub Pages serve em /<repo>/)
const repoName = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  base: "/digo_brindes/",
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
    },
  },
  plugins: [
    runtimeErrorOverlay(),
  ],
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
    assetsDir: "assets",
  },
  publicDir: "public",
});
