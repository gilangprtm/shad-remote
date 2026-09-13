import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import federation from "@originjs/vite-plugin-federation";
import { federationConfig } from "./module-federation.config";

const channel = process.env.REMOTE_CHANNEL ? `/${process.env.REMOTE_CHANNEL}/` : "/";
export default defineConfig({
  base: channel,
  plugins: [react(), tailwindcss(), federation(federationConfig)],
  build: { target: "esnext", modulePreload: false, cssCodeSplit: false },
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 3000,
    strictPort: true,
  },
});
