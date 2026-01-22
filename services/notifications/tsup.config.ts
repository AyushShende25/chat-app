import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	splitting: false,
	clean: true,
	outDir: "dist",
	ignoreWatch: ["logs"],
	format: "esm",
});
