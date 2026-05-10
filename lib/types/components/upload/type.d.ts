import { InputHTMLAttributes, ReactNode, ChangeEvent } from 'react';
import { BaseInput } from '../../type/index.js';
import { IButton } from '../button/type.js';

interface IUpload extends Omit<BaseInput, "ref">, Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    files?: IFile[];
    accept?: string;
    multiple?: boolean;
    directory?: boolean;
    limit?: number;
    sortable?: boolean;
    mode?: "default" | "card";
    droppable?: boolean;
    dropbox?: (dragging?: boolean) => ReactNode;
    cardSize?: string;
    defaultButtonProps?: IButton;
    shouldUpload?: (file: IFile) => boolean;
    uploader?: (file: IFile) => Promise<IFile>;
    renderItem?: (file: IFile, i: number) => ReactNode;
    onFilesChange?: (files: IFile[], changed: IFile[], e?: ChangeEvent<HTMLInputElement>) => void;
    onRemove?: (file: IFile) => void;
    onUpload?: (result: any) => void | Promise<any>;
}
interface IFile extends File {
    id: string;
    instance?: File;
    src?: string;
    url?: string;
    [key: string]: any;
}

export type { IFile, IUpload };
