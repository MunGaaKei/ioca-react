import react from "@vitejs/plugin-react";
import { resolve } from "path";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

const path = (p) => resolve(__dirname, p);

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react(), dynamicImport()],
	resolve: {
		alias: {
			"@": path("."),
			"@p": path("./packages"),
			"@d": path("./docs"),
		},
	},
	css: {
		preprocessorOptions: {
			scss: {
				api: "modern-compiler",
				silenceDeprecations: ["legacy-js-api"],
			},
		},
	},
});
