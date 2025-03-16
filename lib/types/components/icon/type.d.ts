import { HTMLAttributes, ReactNode, RefObject, CSSProperties } from 'react';

interface IIcon extends HTMLAttributes<HTMLElement> {
    icon: ReactNode;
    ref?: RefObject<HTMLOrSVGElement | null>;
    size?: string;
    rotate?: number;
    style?: CSSProperties;
    className?: string;
}

export type { IIcon };
