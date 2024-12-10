import Document from "@d/layouts/document";
import Page404 from "@d/pages/404";
import Home from "@d/pages/home";

export default [
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/docs/:name",
		element: <Document />,
		errorElement: <Page404 />,
	},
	{
		path: "/*",
		element: <Page404 />,
	},
];
