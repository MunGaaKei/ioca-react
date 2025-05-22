import { ReactNode, CSSProperties } from 'react';
import { TPosition } from '../../type/index.js';

interface IPopup {
    visible?: boolean;
    content?: ReactNode;
    trigger?: "hover" | "click" | "focus" | "none" | "contextmenu";
    gap?: number;
    offset?: number;
    fixed?: boolean;
    position?: TPosition;
    arrow?: boolean;
    align?: "start" | "center" | "end";
    showDelay?: number;
    hideDelay?: number;
    touchable?: boolean;
    fitSize?: boolean;
    watchResize?: boolean;
    clickOutside?: boolean;
    disabled?: boolean;
    referToWindow?: boolean;
    style?: CSSProperties;
    children?: ReactNode;
    className?: string;
    getContainer?: (trigger?: HTMLElement) => HTMLElement;
    onVisibleChange?: (visible: boolean) => void;
}

export type { IPopup };
