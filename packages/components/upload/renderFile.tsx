import { TFileType } from "@p/js/usePreview/type";
import { formatBytes, getFileType } from "@p/js/utils";
import { ListAltRound } from "@ricons/material";
import { title } from "radash";
import Icon from "../icon";
import Image from "../image";
import Helpericon from "../utils/helpericon";
import { IUploadItem } from "./type";

export default function RenderFile(props: IUploadItem) {
	const { mode, index, file, onRemove, onPreview } = props;

	if (!file) return "";
	const { name, size, url, src } = file;
	const type = getFileType(name, file.type);

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
							usePreview={false}
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
					className='i-upload-item'
					onClick={() => onPreview?.(index)}
				>
					<span>{name}</span>

					<i className='i-upload-size'>{formatBytes(size ?? 0)}</i>

					{CloseBtn}
				</div>
			);
	}
}
