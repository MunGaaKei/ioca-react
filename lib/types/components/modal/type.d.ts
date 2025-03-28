import { FC, HTMLAttributes, ReactNode } from 'react';
import { IButton } from '../button/type.js';
import useModal from './useModal.js';

interface IModal extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
    visible?: boolean;
    title?: ReactNode;
    footer?: ReactNode;
    closable?: boolean;
    hideCloseButton?: boolean;
    hideBackdrop?: boolean;
    backdropClosable?: boolean;
    width?: string | number;
    height?: string | number;
    customized?: boolean;
    fixed?: boolean;
    hideShadow?: boolean;
    okButtonProps?: IButton;
    cancelButtonProps?: IButton;
    footerLeft?: ReactNode;
    keepDOM?: boolean;
    disableEsc?: boolean;
    onVisibleChange?: (visible: boolean) => void;
    onOk?: () => (void | boolean) | Promise<any>;
    onClose?: () => void;
}
interface CompositionModal extends FC<IModal> {
    useModal: typeof useModal;
}

export type { CompositionModal, IModal };
