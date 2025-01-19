import { TFileType } from "@p/js/usePreview/type";
import { formatBytes, getFileType } from "@p/js/utils";
import { ListAltRound } from "@ricons/material";
import { title } from "radash";
import { RefObject } from "react";
import SortableContainer from "react-easy-sort";
import Icon from "../icon";
import Image from "../image";
import Helpericon from "../utils/helpericon";
import { IUploadItem } from "./type";

export const ListContainer = (props) => {
	const { sortable, onSortEnd, itemProps, ...restProps } = props;
	const customProps = {
		className: "i-upload-list",
		onClick: (e) => {
			e.stopPropagation();
			e.preventDefault();
		},
	};

	if (!sortable) {
		return <div {...customProps} {...restProps} />;
	}
	return (
		<SortableContainer
			onSortEnd={onSortEnd}
			{...customProps}
			{...restProps}
		/>
	);
};

const FileListItem = (
	props: IUploadItem & { ref?: RefObject<HTMLDivElement | null> }
) => {
	const { ref, mode, index, file, renderItem, onRemove, onPreview } = props;

	if (!file) return "";

	const { id, name, size, url, src } = file;
	const type = getFileType(name, file.type);

	if (renderItem) {
		return renderItem(file, index);
	}

	const CloseBtn = (
		<Helpericon
			active
			className='i-upload-delete'
			onClick={(e) => {
				e.stopPropagation();
				e.preventDefault();
				onRemove(index);
			}}
		/>
	);

	switch (mode) {
		case "card":
			let node = <></>;

			switch (type) {
				case TFileType.IMAGE:
					node = (
						<Image
							lazyload
							src={url || src}
							fit='cover'
							onMouseDown={(e) => e.preventDefault()}
						/>
					);
					break;
				case TFileType.VIDEO:
					node = <video src={url || src} preload='none' />;
					break;
				default:
					node = (
						<>
							<Icon icon={<ListAltRound />} />
							<span className='i-upload-file-name'>
								{title(name)}
							</span>
						</>
					);
					break;
			}

			return (
				<div
					ref={ref}
					title={name}
					className='i-upload-item-card'
					onClick={() => onPreview?.(index)}
				>
					{node}
					{CloseBtn}
				</div>
			);
		default:
			return (
				<div
					ref={ref}
					key={id}
					className='i-upload-item'
					onClick={() => onPreview?.(index)}
				>
					<span>{name}</span>

					<i className='i-upload-size'>{formatBytes(size ?? 0)}</i>

					{CloseBtn}
				</div>
			);
	}
};

export default FileListItem;
