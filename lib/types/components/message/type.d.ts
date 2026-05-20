import { ReactNode, CSSProperties } from 'react';

/** User-facing callable config for message() */
interface IMessageConfig {
    content?: ReactNode;
    duration?: number;
    style?: CSSProperties;
    className?: string;
    unshift?: boolean;
    closable?: boolean;
    onShow?: () => void;
    onHide?: () => void;
}
/** Internal runtime message (extends user config with system fields) */
interface IMessage extends IMessageConfig {
    id: string;
    active: boolean;
    align?: string;
    timer?: ReturnType<typeof setTimeout>;
    close?: () => void;
}
/** Props for <Message.Container /> */
interface IMessageContainerProps {
    align?: "center" | "left" | "right";
    fromBottom?: boolean;
    unshift?: boolean;
    gap?: number;
    offset?: string;
    duration?: number;
    className?: string;
    style?: CSSProperties;
}

export type { IMessage, IMessageConfig, IMessageContainerProps };
