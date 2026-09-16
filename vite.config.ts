import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// The admin SPA only. The server is built by tsc, and the public pages are
// rendered by it, so neither passes through here.
export default defineConfig({
  root: "src/web/admin",
  base: "/admin/",
  plugins: [react()],
  build: {
    outDir: "../../../dist/admin",
    emptyOutDir: true,
  },
  server: {
    proxy: {
      "/api": "http://localhost:3000",
      "/auth": "http://localhost:3000",
    },
  },
});
