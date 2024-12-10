import { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { BaseInput } from "../../type";

export interface IUpload
	extends BaseInput,
		Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange"> {
	// action?: string;
	files?: IFile[];
	accept?: string;
	multiple?: boolean;
	directory?: boolean;
	limit?: number;
	mode?: "default" | "card";
	droppable?: boolean;
	cardSize?: string;
	shouldUpload?: (file: IFile) => boolean;
	uploader?: (file: IFile) => Promise<IFile>;
	renderItem?: (file: IFile, i: number) => ReactNode;
	onFilesChange?: (
		files: IFile[],
		changed: IFile[],
		e?: ChangeEvent<HTMLInputElement>
	) => void;
	onRemove?: (file: IFile) => void;
	onUpload?: (file: IFile) => void;
}

export interface IFile extends File {
	uid?: string;
	instance?: File;
	src?: string;
	[key: string]: any;
}

export interface IUploadItem extends Pick<IUpload, "mode"> {
	file?: IFile;
	index: number;
	status?: string;
	onRemove: (i: number) => void;
	onPreview?: (i: number) => void;
}

export interface RefUpload {
	getFileList: () => IFile[];
}
