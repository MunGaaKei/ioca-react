import { ReactNode } from 'react';

interface IMessage {
    id?: string;
    content?: ReactNode;
    active?: boolean;
    duration?: number;
    gap?: number;
    offset?: string;
    max?: number;
    align?: "center" | "left" | "right";
    unshift?: boolean;
    closable?: boolean;
    timer?: ReturnType<typeof setTimeout>;
    className?: string;
    close?: () => void;
    onShow?: () => void;
    onHide?: () => void;
}

export type { IMessage };
