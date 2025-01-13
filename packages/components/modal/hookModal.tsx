import { useReactive } from "ahooks";
import { RefObject, useImperativeHandle } from "react";
import Modal from "./modal";
import { IModal, RefHookModal } from "./type";

const HookModal = (
	props: IModal & { ref?: RefObject<RefHookModal | null> }
) => {
	const { ref } = props;
	const state = useReactive<IModal>({});

	useImperativeHandle(ref, () => ({
		update: (config: IModal = {}) => {
			Object.assign(state, config);
		},
	}));

	return <Modal {...props} {...state} />;
};

export default HookModal;
