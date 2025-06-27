export interface ITheme {
	listenStorageChange?: boolean;
	defaultValue?: string;
	key?: string;
}

export type TSettings = {
	theme?: string;
	update?: (key: string | Record<string, any>, value?) => void;
};
