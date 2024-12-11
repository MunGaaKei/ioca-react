import "@d/assets/common.css";
import "@p/css/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { GlobalContext, useGlobalValues } from "./config/context";
import Router from "./router";

const App = () => {
	const global = useGlobalValues();

	return (
		<React.StrictMode>
			<GlobalContext.Provider value={global}>
				<RouterProvider router={Router} />
			</GlobalContext.Provider>
		</React.StrictMode>
	);
};

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<App />
);
