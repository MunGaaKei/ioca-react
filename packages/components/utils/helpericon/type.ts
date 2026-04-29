import {
    CSSProperties,
    ElementType,
    KeyboardEvent,
    MouseEvent,
    ReactNode,
} from "react";

export interface IHelperIcon {
    as?: ElementType;
    active?: boolean;
    loading?: boolean;
    icon?: ReactNode;
    className?: string;
    style?: CSSProperties;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onMouseUp?: (e: MouseEvent<HTMLElement>) => void;
    onKeyDown?: (e: KeyboardEvent<HTMLElement>) => void;
    tabIndex?: number;
    role?: string;
    "aria-label"?: string;
}
