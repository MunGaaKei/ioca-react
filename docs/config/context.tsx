import { useReactive } from "ahooks";
import { createContext, useEffect } from "react";

export interface IGlobalContext {
	theme: string;
	setTheme: (theme: string) => void;
}

export const GlobalContext = createContext<IGlobalContext>({
	theme: "",
	setTheme: () => null,
});

export const useGlobalValues = () => {
	const state = useReactive({
		theme: "",
	});

	useEffect(() => {
		const cls = document.body.classList;
		const cns = Array.from(cls);
		const pre = cns.find((n) => n.startsWith("theme-"));

		if (pre) {
			cls.replace(pre, state.theme);
			return;
		}

		state.theme && cls.add(state.theme);
	}, [state.theme]);

	return {
		theme: state.theme,
		setTheme: (theme: string) => (state.theme = theme),
	};
};
