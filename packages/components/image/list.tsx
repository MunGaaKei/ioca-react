import usePreview from "@p/js/usePreview";
import { TPreviewItem } from "@p/js/usePreview/type";
import { getFileType, getSuffixByUrl } from "@p/js/utils";
import { useMemo } from "react";
import Flex from "../flex";
import Image from "./image";
import { IImageList } from "./type";

export default function List(props: IImageList) {
	const {
		items = [],
		gap = 8,
		columns,
		wrap,
		direction,
		usePreview: previewable,
		onClick,
		...restProps
	} = props;
	const preview = usePreview();

	const files = useMemo(() => {
		return items.map((item) => {
			const o: TPreviewItem = {
				src: "",
			};
			if (typeof item === "string") {
				o.src = item;
			} else {
				Object.assign(o, item);
			}

			o.suffix = getSuffixByUrl(o.src) || "";
			o.type = getFileType(o.suffix, item["type"]);

			return o;
		});
	}, [items]);

	const handleClick = (e, i) => {
		onClick?.(e);

		previewable &&
			preview({
				items: files,
				initial: i,
			});
	};

	if (!files.length) return "";

	return (
		<Flex
			className='i-image-list'
			gap={gap}
			columns={columns}
			wrap={wrap}
			direction={direction}
		>
			{files.map((img, i) => {
				return (
					<Image
						key={i}
						src={img.src}
						size={60}
						usePreview={false}
						onClick={(e) => handleClick(e, i)}
						{...restProps}
					/>
				);
			})}
		</Flex>
	);
}
