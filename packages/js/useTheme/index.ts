import { useLocalStorageState } from "ahooks";
import { useEffect } from "react";
import { ITheme } from "./type";

const useTheme = (props?: ITheme) => {
	const {
		key = "ioca-react-theme",
		defaultValue,
		listenStorageChange,
	} = props ?? {};
	const [theme, setTheme] = useLocalStorageState<string>(key, {
		defaultValue: defaultValue ?? "",
		listenStorageChange,
	});

	useEffect(() => {
		const cls = document.documentElement.classList;
		const cns = Array.from(cls);
		const pre = cns.find((n) => n.startsWith("theme-")) ?? "";

		if (pre) {
			cls.replace(pre, theme || "theme-auto");
			return;
		}

		theme && cls.add(theme);
	}, [theme]);

	return {
		theme,
		setTheme,
	};
};

export default useTheme;
