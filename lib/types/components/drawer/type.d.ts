/// <reference types="react" />

import { HTMLAttributes, ReactNode } from 'react';

interface IDrawer extends HTMLAttributes<HTMLDivElement> {
    visible?: boolean;
    position?: "top" | "left" | "right" | "bottom";
    header?: ReactNode;
    footer?: ReactNode;
    hideCloseButton?: boolean;
    backdropClosable?: boolean;
    keepDOM?: boolean;
    disabledEsc?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    onClose?: () => void;
}

export type { IDrawer };
