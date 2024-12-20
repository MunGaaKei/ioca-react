import { useLocalStorageState } from "ahooks";
import { createContext, useEffect } from "react";

type TSettings = {
	theme?: string;
	update?: (key: string | Record<string, any>, value?) => void;
};

export const GlobalContext = createContext({});

export const useGlobalValues = () => {
	const [settings = {}, setSettings] = useLocalStorageState<TSettings>(
		"ioca-react-settings",
		{
			defaultValue: {
				theme: "auto",
			},
			listenStorageChange: true,
		}
	);

	const update = (key, value?) => {
		if (typeof key === "string") {
			setSettings({ ...settings, [key]: value });
			return;
		}

		setSettings(key);
	};

	useEffect(() => {
		const cls = document.body.classList;
		const cns = Array.from(cls);
		const pre = cns.find((n) => n.startsWith("theme-"));

		if (pre) {
			cls.replace(pre, settings.theme ?? "theme-auto");
			return;
		}

		settings.theme && cls.add(settings.theme);
	}, [settings?.theme]);

	return {
		...settings,
		update,
	};
};
