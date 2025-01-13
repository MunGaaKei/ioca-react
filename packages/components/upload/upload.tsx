import usePreview from "@p/js/usePreview";
import { TPreviewItem } from "@p/js/usePreview/type";
import { CloudUploadTwotone, PlusSharp } from "@ricons/material";
import { useReactive } from "ahooks";
import classNames from "classnames";
import { uid } from "radash";
import {
	CSSProperties,
	ChangeEvent,
	Fragment,
	useEffect,
	useImperativeHandle,
	useMemo,
	useRef,
} from "react";
import Button from "../button";
import Icon from "../icon";
import InputContainer from "../input/container";
import "./index.css";
import renderFile from "./renderFile";
import { IFile, IUpload } from "./type";

const Upload = (props: IUpload) => {
	const {
		ref,
		label,
		labelInline,
		value,
		files = [],
		placeholder,
		status = "normal",
		message,
		className,
		style,
		children,
		mode = "default",
		cardSize = "4em",
		disabled,
		limit = props.multiple ? Infinity : 1,
		multiple,
		renderItem = renderFile,
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
		update: 0,
	});
	const inputRef = useRef<HTMLInputElement>(null);
	const preview = usePreview();

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
					<Button className='i-upload-btn' disabled={disabled}>
						<Icon icon={<CloudUploadTwotone />} /> Upload
					</Button>
				);
		}
	}, [mode, children]);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(e.target.files || []) as IFile[];
		const { files: before } = state;
		const changed: IFile[] = [];

		files.map((f) => {
			const { name, size, type } = f;
			const same = before.find((pf) => {
				const { name: n, size: s, type: t } = pf;
				return n === name && s === size && t === type;
			});

			const src = URL.createObjectURL(f);
			f.src = src;
			state.update += 1;

			Object.assign(f, {
				uid: uid(7),
				src: f.src || f.name,
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

		files.forEach(async (file) => {
			if (!shouldUpload(file)) return;

			const result = await uploader(file);
			const i = state.files.findIndex((f) => f.uid === result.uid);
			i > -1 && (state.files[i] = result);

			result?.status === "completed" && onUpload?.(result);
		});
	};

	const handlePreview = (i: number) => {
		preview({ items: state.files as TPreviewItem[], initial: i });
	};

	useEffect(() => {
		Object.assign(state, {
			status,
			message,
		});
	}, [status, message]);

	useEffect(() => {
		state.value = value;
	}, [value]);

	useImperativeHandle(
		ref,
		() => ({
			getFileList: () => state.files,
		}),
		[]
	);

	const { message: msg, files: currentFiles } = state;

	return (
		<InputContainer
			label={label}
			labelInline={labelInline}
			className={classNames("i-input-label-file", className)}
			style={style}
		>
			<input
				{...restProps}
				disabled={disabled}
				ref={inputRef}
				type='file'
				className='i-input-file-hidden'
				multiple={multiple}
				onChange={handleChange}
			/>

			<div
				className={classNames("i-upload-inner", {
					[`i-upload-${mode}`]: mode !== "default",
				})}
				style={{ ["--upload-card-size"]: cardSize } as CSSProperties}
			>
				<div
					className='i-upload-list'
					onClick={(e) => {
						e.stopPropagation();
						e.preventDefault();
					}}
				>
					{currentFiles?.map((file: File, i: number) => (
						<Fragment key={i}>
							{renderFile({
								index: i,
								file,
								mode,
								onRemove: handleRemove,
								onPreview: handlePreview,
							})}
						</Fragment>
					))}
				</div>

				{msg && <span className='i-upload-message'>{msg}</span>}

				{currentFiles.length < limit && trigger}
			</div>
		</InputContainer>
	);
};

export default Upload;
