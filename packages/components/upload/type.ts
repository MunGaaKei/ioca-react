import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { BaseInput } from "../../type";
import { IButton } from "../button/type";

export interface IUpload
    extends
        Omit<BaseInput, "ref">,
        Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
    files?: IFile[];
    accept?: string;
    multiple?: boolean;
    directory?: boolean;
    limit?: number;
    sortable?: boolean;
    mode?: "default" | "card";
    droppable?: boolean;
    dropbox?: (dragging?: boolean) => ReactNode;
    getDropboxContainer?: () => HTMLElement;
    cardSize?: string;
    defaultButtonProps?: IButton;
    shouldUpload?: (file: IFile) => boolean;
    uploader?: (file: IFile) => Promise<IFile>;
    renderItem?: (file: IFile, i: number) => ReactNode;
    onFilesChange?: (
        files: IFile[],
        changed: IFile[],
        e?: ChangeEvent<HTMLInputElement>,
    ) => void;
    onRemove?: (file: IFile) => void;
    onUpload?: (result: any) => void | Promise<any>;
}

export interface IFile extends File {
    id: string;
    instance?: File;
    src?: string;
    url?: string;
    [key: string]: any;
}

export interface IUploadItem extends Pick<IUpload, "mode" | "renderItem"> {
    file?: IFile;
    index: number;
    status?: string;
    onRemove: (i: number) => void;
    onPreview?: (i: number) => void;
}

export interface IDropboxProps {
    multiple?: boolean;
    accept?: string;
    disabled?: boolean;
    children?: ReactNode | ((dragging?: boolean) => ReactNode);
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onDropFiles: (files: File[]) => void;
}
