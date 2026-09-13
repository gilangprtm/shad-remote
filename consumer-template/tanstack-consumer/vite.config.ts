import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import federation from "@originjs/vite-plugin-federation";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    allowedHosts: true,
    port: 3001,
    strictPort: true,
  },
  plugins: [
    react(),
    federation({
      name: "tanstack_consumer",
      remotes: {
        edjavu_ui: process.env.VITE_REMOTE_URL || "http://3000.dev.edjavu.cloud/v1/assets/remoteEntry.js",
      },
      shared: { react: { singleton: true }, "react-dom": { singleton: true } },
    }),
  ],
});
