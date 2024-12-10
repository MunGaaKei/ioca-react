import Icon from "@p/components/icon";
import Video from "@p/components/video";
import { FeedOutlined } from "@ricons/material";
import { TFileType, TPreviewItem } from "./type";

export default function renderFile(props: TPreviewItem) {
	const { name, suffix, type } = props;

	switch (type) {
		case TFileType.IMAGE:
			return <img src={props.src} />;
		case TFileType.VIDEO:
			return <Video {...props} />;
		default:
			return (
				<div className='i-preview-unknown'>
					<Icon icon={<FeedOutlined />} size='3em' />
					<h5 className='mt-4'>{name || suffix || "?"}</h5>
				</div>
			);
	}
}
