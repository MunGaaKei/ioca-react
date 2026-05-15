import { HTMLAttributes } from 'react';

interface IScroll extends HTMLAttributes<HTMLDivElement> {
    draggable?: boolean;
}

export type { IScroll };
