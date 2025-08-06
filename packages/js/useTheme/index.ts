import { useLocalStorageState } from "ahooks";
import { useEffect, useState } from "react";
import { ITheme } from "./type";

const useTheme = (props?: ITheme) => {
	const {
		key = "ioca-react-theme",
		defaultValue = "theme-auto",
		listenStorageChange,
	} = props ?? {};

	const [mounted, setMounted] = useState(false);

	const [theme, setTheme] = useLocalStorageState<string>(key, {
		defaultValue,
		listenStorageChange,
	});

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted || !theme) return;

		const cls = document.documentElement.classList;
		const prev = Array.from(cls).find((n) => n.startsWith("theme-"));

		if (prev) {
			cls.replace(prev, theme);
		} else {
			cls.add(theme);
		}
	}, [theme, mounted]);

	return {
		theme: mounted ? theme : defaultValue,
		setTheme: mounted ? setTheme : () => {},
	};
};

export default useTheme;
