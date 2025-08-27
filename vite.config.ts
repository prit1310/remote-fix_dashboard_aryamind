import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy:
      mode === "development"
        ? {
            "/api": {
              target: "http://localhost:4000", // backend in dev
              changeOrigin: true,
              secure: false,
            },
          }
        : undefined,
  },
  preview: {
    host: "0.0.0.0",
    port: 8081,
    allowedHosts: ["remotefix.shwetatech.com"], // ✅ allow your domain
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
