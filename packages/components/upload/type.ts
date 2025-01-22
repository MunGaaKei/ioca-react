import { ChangeEvent, InputHTMLAttributes, ReactNode, RefObject } from "react";
import { BaseInput } from "../../type";

export interface IUpload
	extends Omit<BaseInput, "ref">,
		Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
	ref?: RefObject<RefUpload | null>;
	files?: IFile[];
	initialFiles?: IFile[] | File[];
	accept?: string;
	multiple?: boolean;
	directory?: boolean;
	limit?: number;
	sortable?: boolean;
	mode?: "default" | "card";
	droppable?: boolean;
	cardSize?: string;
	defaultText?: ReactNode;
	shouldUpload?: (file: IFile) => boolean;
	uploader?: (file: IFile) => Promise<IFile>;
	renderItem?: (file: IFile, i: number) => ReactNode;
	onFilesChange?: (
		files: IFile[],
		changed: IFile[],
		e?: ChangeEvent<HTMLInputElement>
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

export interface RefUpload {
	getFileList: () => IFile[];

	setFileList: (files?: IFile[] | File[]) => void;
}
