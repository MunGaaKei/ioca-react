import { useReactive } from "ahooks";
import { RefObject, useImperativeHandle } from "react";
import Modal from "./modal";
import { IModal, RefHookModal } from "./type";

const HookModal = (
	props: IModal & { ref?: RefObject<RefHookModal | null> }
) => {
	const { ref } = props;
	const state = useReactive<IModal>({});

	const mergedProps = Object.assign({}, props, state);

	useImperativeHandle(ref, () => ({
		update: (config: IModal = {}) => {
			Object.assign(state, config);
		},

		close: () => {
			state.visible = false;

			if (mergedProps.closable) return;
			Promise.resolve().then(() => {
				state.visible = true;
			});
		},
	}));

	return <Modal {...mergedProps} />;
};

export default HookModal;
