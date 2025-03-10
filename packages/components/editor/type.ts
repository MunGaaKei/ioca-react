import { FormEvent, RefObject } from "react";

export interface IEditor {
	ref?: RefObject<RefEditor | null>;
	placeholder?: string;
	width?: string | number;
	height?: string | number;
	autosize?: boolean;
	richPaste?: boolean;
	controls?: string[] | "simple" | "all" | "none";
	border?: boolean;
	onInput?: (html: string, e: FormEvent<HTMLDivElement>) => void;
}

export interface RefEditor {
	getSafeValue: () => string;
	setValue: (html: string) => void;
}
