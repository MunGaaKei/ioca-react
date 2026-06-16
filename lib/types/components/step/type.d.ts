import { CSSProperties, ReactNode } from 'react';

interface IStep {
    active?: number;
    vertical?: boolean;
    style?: CSSProperties;
    className?: string;
    line?: ReactNode;
    children?: ReactNode;
    asList?: boolean;
    renderIcon?: (i: number, status: string) => ReactNode;
    onClick?: (i: number) => void;
}
interface IStepItem extends IStep {
    index?: number;
    title?: ReactNode;
}

export type { IStep, IStepItem };
