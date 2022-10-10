const esbuild = require("esbuild");

esbuild
  .build({
    entryPoints: ["src/presentation/index.ts"],
    outdir: "./dist",
    platform: "node",
    minify: true,
    sourcemap: true,
    target: "es2020",
    bundle: true,
    external: [],
    watch: false,
  })
  .catch(() => process.exit(1));
