import { renderNode } from "@p/js/utils";
import { useRef } from "react";
import HookModal from "./hookModal";
import { IModal, RefHookModal } from "./type";

export default function useModal() {
	const ref = useRef<RefHookModal>(null);

	const handleOpen = (props: IModal) => {
		const unMount = renderNode(
			<HookModal
				ref={ref}
				visible
				{...props}
				onClose={() => {
					props.onClose?.();
					unMount?.();
				}}
			/>
		);
	};

	const handleUpdate = (props: IModal) => {
		if (!ref.current) return;

		const { update } = ref.current;
		update(props);
	};

	const handleClose = () => {
		if (!ref.current) return;

		const { close } = ref.current;
		close();
	};

	return {
		open: handleOpen,
		update: handleUpdate,
		close: handleClose,
	};
}
