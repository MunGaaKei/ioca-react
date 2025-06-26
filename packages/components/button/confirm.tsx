import { useReactive } from "ahooks";
import Button from "./button";
import type { IButton, IButtonConfirm } from "./type";

const defaultOk = {
	children: "确定",
	className: "bg-error",
};

const defaultCancel = {
	children: "取消",
	secondary: true,
};

export default function Confirm(props: IButtonConfirm) {
	const {
		ref,
		size,
		okButtonProps,
		cancelButtonProps,
		onOk,
		onCancel,
		onClick,
		...restProps
	} = props;

	const state = useReactive({
		active: false,
		loading: false,
	});

	const ok: IButton = okButtonProps
		? Object.assign({}, defaultOk, okButtonProps)
		: defaultOk;
	const cancel: IButton = cancelButtonProps
		? Object.assign({}, defaultCancel, cancelButtonProps)
		: defaultCancel;

	const handleClick = (e) => {
		onClick?.(e);
		state.active = true;
	};

	const hanldeOk = async () => {
		if (state.loading) return;
		state.loading = true;

		try {
			const res = await onOk?.();

			if (res !== false) {
				state.active = false;
			}
		} finally {
			state.loading = false;
		}
	};

	const handleCancel = () => {
		onCancel?.();
		state.active = false;
	};

	if (!state.active) {
		return (
			<Button
				ref={ref}
				size={size}
				{...restProps}
				onClick={handleClick}
			/>
		);
	}

	return (
		<Button.Group>
			<Button
				size={size}
				{...ok}
				loading={state.loading}
				onClick={hanldeOk}
			/>
			<Button
				size={size}
				{...cancel}
				disabled={state.loading}
				onClick={handleCancel}
			/>
		</Button.Group>
	);
}
