import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/server.ts"],
	splitting: false,
	clean: true,
	outDir: "dist",
	ignoreWatch: ["logs"],
	format: "esm",
});
