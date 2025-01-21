import { FormEvent, RefObject } from "react";

export interface IEditor {
	ref?: RefObject<RefEditor | null>;
	placeholder?: string;
	width?: string | number;
	height?: string | number;
	autosize?: boolean;
	controls?: string[] | "simple" | "all";
	onInput?: (html: string, e: FormEvent<HTMLDivElement>) => void;
}

export interface RefEditor {
	getSafeValue: () => string;
	setValue: (html: string) => void;
}
