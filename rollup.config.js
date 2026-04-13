import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import fs from "node:fs/promises";
import path from "node:path";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import scss from "rollup-plugin-scss";

const externals = [
	"react",
	"react-dom",
	"react-router",
	"react-easy-sort",
	"react/jsx-runtime",
	"@types/react",
	"classnames",
	"dayjs",
	"@rc-component/color-picker",
	"xss",
	/node_modules/,
];

const input = "./packages/index.ts";
const plugins = [
	external(),
	resolve({
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css", ".scss"],
		preferBuiltins: true,
		moduleDirectories: ["node_modules"],
	}),
	commonjs({
		include: /node_modules/,
		requireReturnsDefault: "auto",
		transformMixedEsModules: true,
		esmExternals: true,
	}),
	typescript({
		tsconfig: "./tsconfig.json",
		compilerOptions: {
			allowImportingTsExtensions: false,
		},
		declaration: false,
		exclude: ["**/__tests__/**"],
		skipLibCheck: true,
	}),
];

const onwarn = (warning, warn) => {
	if (warning.code === "CIRCULAR_DEPENDENCY") return;
	warn(warning);
};

const copyCssAssets = () => ({
	name: "copy-css-assets",
	async generateBundle() {
		const outDir = path.join(process.cwd(), "lib", "css");
		await fs.mkdir(outDir, { recursive: true });
		const files = [
			"tokens.css",
			"reset.css",
			"utilities.css",
			"colors.css",
			"input.css",
		];
		await Promise.all(
			files.map((file) =>
				fs.copyFile(
					path.join(process.cwd(), "packages", "css", file),
					path.join(outDir, file)
				)
			)
		);
	},
});

export default [
	// CSS 单独打包
	{
		input,
		output: {
			dir: "lib",
		},
		onwarn,
		external: externals,
		plugins: [
			...plugins,
			scss({
				fileName: "css/index.css",
				sourceMap: true,
				outputStyle: "compressed",
				silenceDeprecations: ["legacy-js-api"],
			}),
			copyCssAssets(),
		],
	},
	{
		input,
		output: [
			{
				dir: "lib/es",
				format: "esm",
				preserveModules: true,
				preserveModulesRoot: "packages",
				exports: "named",
				sourcemap: true,
			},
			{
				dir: "lib/cjs",
				format: "cjs",
				preserveModules: true,
				preserveModulesRoot: "packages",
				exports: "named",
				sourcemap: true,
				interop: "compat",
				externalLiveBindings: false,
			},
		],
		onwarn,
		external: externals,
		plugins: [
			...plugins,
			scss({ output: false, silenceDeprecations: ["legacy-js-api"] }),
		],
	},
	// 类型声明文件
	{
		input,
		output: {
			dir: "lib/types",
			preserveModules: true,
			preserveModulesRoot: "packages",
		},
		onwarn,
		external: [...externals, /\.scss$/, /\.css$/],
		plugins: [
			scss({ output: false, silenceDeprecations: ["legacy-js-api"] }),
			dts({
				respectExternal: true,
				compilerOptions: {
					preserveSymlinks: false,
					esModuleInterop: true,
				},
			}),
		],
	},
];
