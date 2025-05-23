import { HTMLAttributes, RefObject, FormEvent } from 'react';

interface IEditor extends Omit<HTMLAttributes<HTMLDivElement>, "onInput"> {
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
interface RefEditor {
    input: HTMLDivElement | null;
    getSafeValue: () => string;
    setValue: (html: string) => void;
}

export type { IEditor, RefEditor };
