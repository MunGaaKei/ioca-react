import { useRef } from "react";
import HookModal from "../../components/modal/hookModal";
import type { RefHookModal } from "../../components/modal/type";
import { renderNode } from "../utils";
import Content from "./content";
import "./index.css";
import type { IPreview } from "./type";

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
				hideShadow
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
