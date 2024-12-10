import HookModal from "@p/components/modal/hookModal";
import { RefHookModal } from "@p/components/modal/type";
import { useRef } from "react";
import { renderNode } from "../utils";
import Content from "./content";
import "./index.css";
import { IPreview } from "./type";

export default function usePreview() {
	const ref = useRef<RefHookModal>(null);

	const preview = (config: IPreview) => {
		const { items, modalProps, onClose, ...restProps } = config;

		const handleClose = () => {
			onClose?.();
			unMount?.();
		};

		const unMount = renderNode(
			<HookModal
				ref={ref}
				visible
				className='i-preview'
				customized
				shadow={false}
				{...modalProps}
				children={
					<Content
						{...restProps}
						items={items}
						onClose={() => {
							ref.current?.update({ visible: false });
						}}
					/>
				}
				fixed
				onClose={handleClose}
			/>
		);
	};

	return preview;
}
