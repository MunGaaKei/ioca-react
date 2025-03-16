import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import scss from "rollup-plugin-scss";

const name = "@ioca/react";
const externals = [
	"react",
	"react-dom",
	"react/jsx-runtime",
	"@types/react",
	"@rc-component/color-picker/assets/index.css",
	/node_modules/,
];

export default [
	// ESM 构建
	{
		input: "packages/index.ts",
		output: {
			dir: "lib",
			format: "esm",
			preserveModules: true,
			preserveModulesRoot: "packages",
			exports: "named",
			sourcemap: true,
		},
		external: externals,
		plugins: [
			external(),
			resolve({
				extensions: [".ts", ".tsx", ".js", ".jsx", ".scss"],
				moduleDirectories: ["node_modules"],
			}),
			typescript({
				tsconfig: "./tsconfig.json",
				declaration: false,
				exclude: ["**/__tests__/**"],
				moduleResolution: "node",
			}),
			scss({
				fileName: "css/index.css",
				sourceMap: true,
				outputStyle: "compressed",
			}),
			terser(),
		],
	},
	// 类型声明文件构建
	{
		input: "packages/index.ts",
		output: {
			dir: "lib/types",
			preserveModules: true,
			preserveModulesRoot: "packages",
		},
		external: [...externals, /\.scss$/, /\.css$/],
		plugins: [
			dts({
				respectExternal: true,
				compilerOptions: {
					preserveSymlinks: false,
				},
			}),
			scss({
				output: false,
			}),
		],
	},
];
