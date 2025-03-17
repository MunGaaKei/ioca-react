/// <reference types="react" />

import { CSSProperties, ReactNode } from 'react';
import { BaseInput } from '../../type/index.js';

interface IProgress extends Omit<BaseInput, "value" | "hideClear" | "onChange"> {
    name?: string;
    value?: number;
    precision?: number;
    height?: number;
    circleSize?: number;
    lineWidth?: number;
    size?: number;
    barClass?: string;
    draggable?: boolean;
    vertical?: boolean;
    type?: "line" | "circle";
    className?: string;
    style?: CSSProperties;
    renderCursor?: (value: number) => ReactNode;
    onDraggingChange?: (dragging: boolean) => void;
    onChange?: (value: number) => void;
}

export type { IProgress };
