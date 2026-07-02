import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import external from "rollup-plugin-peer-deps-external";
import postcss from "rollup-plugin-postcss";
import postcssImport from "postcss-import";

const externals = [
    "react",
    "react-dom",
    "react/jsx-runtime",
    "react-router",

    "@rc-component/color-picker",
    "@ricons/material",
    "classnames",
    "dayjs",
    "highlight-words-core",
    "pubsub-js",
    "radash",
    "react-easy-sort",
    "react-window",
    "xss",

    /node_modules/,
];

const input = "./packages/index.ts";

const plugins = [
    external(),
    resolve({
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json", ".css"],
        preferBuiltins: true,
        moduleDirectories: ["node_modules"],
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

export default [
    {
        input,
        output: {
            dir: "lib",
        },
        onwarn,
        external: externals,
        plugins: [
            ...plugins,
            postcss({
                extract: "css/index.css",
                minimize: true,
                extensions: [".css"],
                plugins: [postcssImport()],
            }),
        ],
    },

    {
        input,
        output: {
            dir: "lib/es",
            format: "esm",
            preserveModules: true,
            preserveModulesRoot: "packages",
            exports: "named",
        },
        onwarn,
        external: (id) => externals.some((e) => (typeof e === "string" ? e === id : e.test(id))),
        plugins: [
            ...plugins,
            postcss({
                inject: false,
                extract: false,
                extensions: [".css"],
            }),
        ],
    },

    {
        input,
        output: {
            dir: "lib/types",
            preserveModules: true,
            preserveModulesRoot: "packages",
        },
        onwarn,
        external: [...externals, /\.css$/],
        plugins: [
            dts({
                respectExternal: true,
                compilerOptions: {
                    preserveSymlinks: false,
                    esModuleInterop: true,
                },
            }),
        ],
    },

    {
        input: "packages/css/colorpicker.css",
        output: {
            dir: "lib",
        },
        onwarn,
        plugins: [
            postcss({
                extract: "css/colorpicker.css",
                minimize: true,
                extensions: [".css"],
                plugins: [postcssImport()],
            }),
        ],
    },
];
