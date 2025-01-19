import { Upload } from "@p";

export const DBasic = {
	demo: <Upload />,
	code: `<Upload />`,
	lang: "xml",
};

export const DUploadCard = {
	demo: <Upload mode='card' limit={3} multiple sortable />,
	code: `<Upload mode='card' limit={3} multiple sortable />`,
	lang: "xml",
};

export const PFile = `interface IFile extends File {
	id: string;

	instance?: File;

	src?: string;

	[key: string]: any;
}
`;

export const PRefFile = `interface RefUpload {
	getFileList: () => IFile[];

	setFileList: (files?: IFile[] | File[]) => void;
}
`;

export const PUpload = [
	{
		name: "files",
		desc: "文件列表",
		type: [
			<a href='#ifile' className='blue'>
				IFile[]
			</a>,
		],
	},
	{
		name: "accept",
		desc: "接受文件类型",
		type: ["string"],
	},
	{
		name: "multiple",
		desc: "可选择多文件",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "directory",
		desc: "选择文件夹",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "limit",
		desc: "多选时，最多可选多少个文件",
		type: ["number"],
	},
	{
		name: "mode",
		desc: "显示模式",
		type: ["'default'", "'card'"],
		def: "'default'",
	},
	{
		name: "sortable",
		desc: "上传子项支持排序",
		type: ["boolean"],
	},
	{
		name: "droppable",
		desc: "可以通过拖动上传",
		type: ["boolean"],
		def: "false",
	},
	{
		name: "cardSize",
		desc: "卡片模式下，卡片大小",
		type: ["string"],
	},
	{
		name: "shouldUpload",
		desc: "判断文件是否可以上传",
		type: ["(file: IFile) => boolean"],
	},
	{
		name: "uploader",
		desc: "文件上传动作",
		type: ["(file: IFile) => Promise<IFile>"],
	},
	{
		name: "renderItem",
		desc: "渲染文件列表项，如果使用了 sortable 属性，请保证返回的元素有 ref 属性",
		type: ["(file: IFile, index: number) => ReactNode"],
	},
	{
		name: "onFilesChange",
		desc: "文件列表改变时触发",
		type: [
			"(files: IFile[], changed: IFile[], e: ChangeEvent<HTMLInputElement>) => void",
		],
		event: true,
	},
	{
		name: "onRemove",
		desc: "删除文件时触发",
		type: ["(file: IFile) => void"],
		event: true,
	},
	{
		name: "onUpload",
		desc: "上传文件时触发",
		type: ["(file: IFile) => void"],
		event: true,
	},
];
