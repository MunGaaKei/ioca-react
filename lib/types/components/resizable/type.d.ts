/// <reference types="react" />

import { ReactNode, CSSProperties } from 'react';

interface IResizable {
    other?: ReactNode;
    children?: ReactNode;
    style?: CSSProperties;
    className?: string;
    asPercent?: boolean;
    vertical?: boolean;
    line?: ReactNode;
    height?: string | number;
    size?: string | number;
    minSize?: string | number;
    maxSize?: string | number;
    onResize?: (size: string | number) => void;
    onResizeComplete?: (size: string | number) => void;
}

export type { IResizable };
