import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // Add this 'server' object
    host: "0.0.0.0", // This makes it accessible from your local network
    // You can also specify a port if you need a specific one, e.g.:
    // port: 3000,
    // strictPort: true, // Optional: Exit if port is already in use
  },
  preview: {
    // Also consider adding this for `vite preview`
    host: "0.0.0.0",
     port: 5173, // Default port for preview, can be specified
  },
});
