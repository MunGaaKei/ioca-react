import { CSSProperties, ReactNode } from 'react';
import { IModal } from '../../components/modal/type.js';

type TPreviewItem = {
    src: string;
    name?: ReactNode;
    thumb?: string;
    rotate?: number;
    zoom?: number;
    style?: CSSProperties;
    type?: TFileType;
    suffix?: string;
};
declare enum TFileType {
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    AUDIO = "AUDIO",
    PDF = "PDF",
    EXCEL = "EXCEL",
    TXT = "TXT",
    UNKNOWN = "UNKNOWN"
}
interface IPreview {
    items: (TPreviewItem | string)[];
    initial?: number;
    controls?: boolean;
    loop?: boolean;
    className?: string;
    style?: CSSProperties;
    modalProps?: IModal;
    renderImage?: (file: TPreviewItem) => ReactNode;
    renderFile?: (file: TPreviewItem) => ReactNode;
    onClose?: () => void;
    onChange?: (after: number, before?: number) => void;
    onZoom?: (scale: number) => void;
    onRotate?: (deg: number) => void;
}

export { type IPreview, TFileType, type TPreviewItem };
