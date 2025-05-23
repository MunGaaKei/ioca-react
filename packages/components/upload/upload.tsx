import { DriveFolderUploadOutlined, PlusSharp } from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { uid } from "radash";
import {
	ChangeEvent,
	CSSProperties,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";
import { SortableItem } from "react-easy-sort";
import usePreview from "../../js/usePreview";
import { TPreviewItem } from "../../js/usePreview/type";
import { arrayMove } from "../../js/utils";
import Button from "../button";
import Icon from "../icon";
import InputContainer from "../input/container";
import "./index.css";
import FileListItem, { ListContainer } from "./renderFile";
import { IFile, IUpload } from "./type";

const Upload = (props: IUpload) => {
	const {
		ref,
		label,
		labelInline,
		value,
		files = [],
		initialFiles,
		placeholder,
		status = "normal",
		message,
		className,
		style,
		children,
		defaultButtonProps,
		mode = "default",
		cardSize = "4em",
		disabled,
		sortable,
		limit = props.multiple ? Infinity : 1,
		multiple,
		renderItem,
		shouldUpload = () => true,
		uploader,
		onChange,
		onFilesChange,
		onUpload,
		...restProps
	} = props;

	const state = useReactive({
		files,
		value,
		status,
		message,
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const preview = usePreview();
	const defBtnProps = Object.assign(
		{
			children: (
				<>
					<Icon icon={<DriveFolderUploadOutlined />} /> 上传
				</>
			),
		},
		defaultButtonProps
	);

	const trigger = useMemo(() => {
		if (children) return children;

		switch (mode) {
			case "card":
				return (
					<Button
						className='i-upload-card-btn color-5'
						square
						flat
						outline
						disabled={disabled}
					>
						<Icon icon={<PlusSharp />} />
					</Button>
				);
			default:
				return (
					<Button
						{...defBtnProps}
						className={classNames(
							"i-upload-btn",
							defBtnProps.className
						)}
						disabled={disabled}
					/>
				);
		}
	}, [mode, children]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []) as IFile[];
		const { files: before } = state;
		const changed: IFile[] = [];

		files.map((f) => {
			const { id, name, size, type } = f;
			const same = before.find((pf) => {
				const { name: n, size: s, type: t } = pf;
				return n === name && s === size && t === type;
			});
			const src = URL.createObjectURL(f);

			Object.assign(f, {
				id: id ?? uid(7),
				src: src ?? f.name,
				url: src ?? f.name,
			});
			!same && changed.push(f);
		});

		const after = [...before, ...changed];

		Object.assign(state, {
			files: multiple ? after.slice(0, limit) : [after.at(-1)],
			status,
			message,
		});

		onFilesChange?.(state.files, changed, e);
		onChange?.(state.files, e);

		handleUpload(changed);
		inputRef.current && (inputRef.current.value = "");
	};

	const handleRemove = (i: number) => {
		const [...files] = state.files;

		const changed = files.splice(i, 1);
		URL.revokeObjectURL(changed[0]?.src || "");

		state.files = files;
		onFilesChange?.(files, changed);
		onChange?.(files);

		inputRef.current && (inputRef.current.value = "");
	};

	const handleUpload = async (files: IFile[]) => {
		if (!uploader) return;

		const shouldUploadFiles = files.filter(shouldUpload);

		const result = Promise.all(shouldUploadFiles.map(uploader));

		return onUpload?.(result);
	};

	const handlePreview = (i: number) => {
		preview({ items: state.files as TPreviewItem[], initial: i });
	};

	const setFileList = (files?: IFile[] | File[]) => {
		if (!files) return;

		state.files = files.map((f) => {
			return { ...f, id: f.id ?? uid(7) };
		});
	};

	const handleSortEnd = (before, after) => {
		const [...files] = state.files;

		state.files = arrayMove(files, before, after);
		onChange?.(state.files);
	};

	useEffect(() => {
		Object.assign(state, {
			status,
			message,
		});
	}, [status, message]);

	useEffect(() => {
		state.files = value?.filter?.((file) => !!file.id) ?? [];
	}, [value]);

	useEffect(() => {
		setFileList(initialFiles);
	}, []);

	useImperativeHandle(
		ref,
		() => ({
			getFileList: () => state.files,

			setFileList,
		}),
		[]
	);

	return (
		<InputContainer
			as='div'
			label={label}
			labelInline={labelInline}
			className={classNames("i-input-label-file", className)}
			style={style}
		>
			<div
				className={classNames("i-upload-inner", {
					[`i-upload-${mode}`]: mode !== "default",
				})}
				style={{ ["--upload-card-size"]: cardSize } as CSSProperties}
			>
				<ListContainer sortable={sortable} onSortEnd={handleSortEnd}>
					{state.files.map((file: IFile, i: number) => {
						const node = (
							<FileListItem
								key={i}
								index={i}
								file={file}
								mode={mode}
								renderItem={renderItem}
								onRemove={handleRemove}
								onPreview={handlePreview}
							/>
						);

						if (!sortable) return node;

						return <SortableItem key={i}>{node}</SortableItem>;
					})}
				</ListContainer>

				{state.message && (
					<span className='i-upload-message'>{state.message}</span>
				)}

				{state.files.length < limit && (
					<label>
						<input
							{...restProps}
							disabled={disabled}
							ref={inputRef}
							type='file'
							className='i-input-file-hidden'
							multiple={multiple}
							onChange={handleChange}
						/>
						{trigger}
					</label>
				)}
			</div>
		</InputContainer>
	);
};

export default Upload;
