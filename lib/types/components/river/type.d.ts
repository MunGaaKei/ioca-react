import { HTMLAttributes } from 'react';

interface IRiver extends HTMLAttributes<HTMLDivElement> {
    speed?: number;
    pauseOnHover?: boolean;
}

export type { IRiver };
