import { HTMLAttributes, RefObject } from 'react';
import { IProgress } from '../progress/type.js';

interface IVideo extends HTMLAttributes<HTMLVideoElement> {
    ref?: RefObject<RefVideo | null>;
    src?: string;
    hideControls?: boolean;
    autoplay?: boolean;
    muted?: boolean;
    volume?: number;
    height?: number | string;
    width?: number | string;
    useOriginControls?: boolean;
    poster?: string;
    timeProgressProps?: IProgress;
    volumeProgressProps?: IProgress;
    onFullScreenChange?: (fullscreen: boolean) => void;
}
interface RefVideo {
    play: () => void;
    pause: () => void;
    stop: () => void;
    fullscreen: (full?: boolean) => void;
    getVideo: () => HTMLVideoElement | null;
}

export type { IVideo, RefVideo };
