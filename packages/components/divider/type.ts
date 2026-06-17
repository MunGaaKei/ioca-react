import { HTMLAttributes, ReactNode } from "react";

export interface IDivider extends HTMLAttributes<HTMLLIElement> {
    children?: ReactNode;
    color?: string;
    width?: number | string;
}
