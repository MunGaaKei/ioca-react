import { ReactNode, CSSProperties } from 'react';

type IData = {
    label: ReactNode;
    value: ReactNode;
    colSpan?: number;
    rowSpan?: number;
    hidden?: boolean;
    style?: CSSProperties;
};
interface IDescription {
    data: IData[];
    align?: string;
    colon?: ReactNode;
    gap?: string | number;
    equally?: boolean;
    columns?: number;
    vertical?: boolean;
    labelWidth?: string | number;
    labelAlign?: "left" | "right" | "center" | "justify";
    style?: CSSProperties;
    className?: string;
}

export type { IDescription };
