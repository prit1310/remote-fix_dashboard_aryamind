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
            target: "http://localhost:4000",
            changeOrigin: true,
            secure: false,
          },
          "/order": {
            target: "http://localhost:4000",
            changeOrigin: true,
            secure: false,
          },
          "/verify": {
            target: "http://localhost:4000",
            changeOrigin: true,
            secure: false,
          },
          "/payment-status": {
            target: "http://localhost:4000",
            changeOrigin: true,
            secure: false,
          },
          "/razorpay-webhook": {
            target: "http://localhost:4000",
            changeOrigin: true,
            secure: false,
          },
        }
        : undefined,
  },
  preview: {
    host: "0.0.0.0",
    port: 8081,
    allowedHosts: ["remotefix.shwetatech.com"],
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
