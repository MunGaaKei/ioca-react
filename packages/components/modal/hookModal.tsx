import { useReactive } from "ahooks";
import { forwardRef, useImperativeHandle } from "react";
import Modal from "./modal";
import { IModal, RefHookModal } from "./type";

const HookModal = forwardRef<RefHookModal, IModal>((props, ref) => {
	const state = useReactive<IModal>({});

	useImperativeHandle(ref, () => ({
		update: (config: IModal = {}) => {
			Object.assign(state, config);
		},
	}));

	return <Modal {...props} {...state} />;
});

export default HookModal;
