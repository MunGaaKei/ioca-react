import { ReactNode } from 'react';
import { IButton } from '../button/type.js';
import { IPopup } from '../popup/type.js';

interface IPopconfirm extends IPopup {
    icon?: ReactNode;
    okButtonProps?: IButton;
    cancelButtonProps?: IButton;
    extra?: ReactNode;
    onOk?: () => Promise<void> | void;
    onClose?: () => Promise<void> | void;
}

export type { IPopconfirm };
