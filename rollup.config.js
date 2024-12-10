import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import scss from "rollup-plugin-scss";

const name = "@ioca/react";

export default [
	{
		input: "./packages/index.ts",
		output: [
			{
				name,
				dir: "lib",
				format: "es",
				exports: "named",
				sourcemap: true,
				globals: {
					react: "React",
				},
			},
		],
		external: [
			"react",
			"react-dom",
			"react/jsx-runtime",
			"radash",
			"dayjs",
			"pubsub-js",
			"ahooks",
			/node_modules/,
		],
		plugins: [
			resolve({
				extensions: [".ts", ".tsx", ".scss", ".js"],
			}),
			typescript(),
			external(),
			scss({
				fileName: "css/index.css",
				sourceMap: true,
				outputStyle: "compressed",
			}),
			terser(),
		],
	},
	{
		input: "./packages/types.ts",
		output: [{ file: "lib/index.d.ts", format: "es" }],
		plugins: [
			dts(),
			scss({
				output: false,
			}),
		],
	},
];
