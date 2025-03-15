import resolve from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import scss from "rollup-plugin-scss";

const name = "@ioca/react";
const externals = ["react", "react-dom", "react/jsx-runtime", /node_modules/];

export default [
	{
		input: "./packages/index.ts",
		output: [
			{
				name,
				dir: "lib",
				format: "esm",
				exports: "named",
				sourcemap: true,
			},
		],
		external: externals,
		plugins: [
			resolve({
				extensions: [".ts", ".tsx", ".scss"],
			}),
			scss({
				fileName: "css/index.css",
				sourceMap: true,
				outputStyle: "compressed",
			}),
			typescript(),
			external(),
			terser(),
		],
	},
	{
		input: "./packages/index.ts",
		output: [{ file: "lib/types/index.d.ts" }],
		plugins: [
			dts({}),
			scss({
				output: false,
			}),
		],
	},
];
