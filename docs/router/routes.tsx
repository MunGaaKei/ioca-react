import Document from "@d/layouts/document";
import Page404 from "@d/pages/404";
import Home from "@d/pages/home";
import { lazy } from "react";

const globs = import.meta.glob("@d/pages/*/index.tsx") as any;
const maps = {};
Object.keys(globs).map((k, i) => {
	const name = k.split("/")[3];
	maps[name] = lazy(globs[k]);
	return;
});

export default [
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/docs",
		element: <Document />,
		errorElement: <Page404 />,
		children: Object.keys(maps).map((name) => {
			return {
				path: name,
				Component: maps[name],
			};
		}),
	},
	{
		path: "/*",
		element: <Page404 />,
	},
];
