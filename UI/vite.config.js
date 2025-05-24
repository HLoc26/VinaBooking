import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
	base: "/",
	plugins: [react()],
	build: {
		outDir: "dist",
	},
	server: {
		host: "0.0.0.0",
		port: 5173,
		strictPort: true,
		watch: {
			usePolling: true,
		},
	},
});
