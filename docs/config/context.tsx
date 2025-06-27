import { useLocalStorageState } from "ahooks";
import { createContext } from "react";

type TSettings = {
	update?: (key: string | Record<string, any>, value?) => void;
};

export const GlobalContext = createContext({});

export const useGlobalValues = () => {
	const [settings = {}, setSettings] = useLocalStorageState<TSettings>(
		"ioca-react-settings",
		{
			defaultValue: {},
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
	return {
		update,
	};
};
