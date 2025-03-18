import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
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
	"ahooks",
	"dayjs",
	"@rc-component/color-picker",
	"xss",
	/node_modules/,
];

const input = "./packages/index.ts";
const plugins = [
	external(),
	resolve({
		extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".scss"],
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
		declaration: false,
		exclude: ["**/__tests__/**"],
		moduleResolution: "node",
		skipLibCheck: true,
	}),
];

export default [
	// CSS 单独打包
	{
		input,
		output: {
			dir: "lib",
		},
		external: externals,
		plugins: [
			...plugins,
			scss({
				fileName: "css/index.css",
				sourceMap: true,
				outputStyle: "compressed",
			}),
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
				environment: {
					node: true,
				},
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
				environment: {
					node: true,
				},
			},
		],
		external: externals,
		plugins: [...plugins, scss({ output: false })],
	},
	// 类型声明文件
	{
		input,
		output: {
			dir: "lib/types",
			preserveModules: true,
			preserveModulesRoot: "packages",
		},
		external: [...externals, /\.scss$/, /\.css$/],
		plugins: [
			scss({ output: false }),
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
