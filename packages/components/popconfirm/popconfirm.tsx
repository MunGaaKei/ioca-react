import { InfoOutlined } from "@ricons/material";
import { useReactive } from "ahooks";
import { MouseEvent } from "react";
import Button from "../button";
import { IButton } from "../button/type";
import Flex from "../flex";
import Icon from "../icon";
import Popup from "../popup";
import "./index.css";
import { IPopconfirm } from "./type";

const defaultOk = {
	children: "确定",
};

const defaultCancel = {
	children: "取消",
	secondary: true,
};

const Popconfirm = (props: IPopconfirm) => {
	const {
		trigger = "click",
		visible,
		icon = <Icon icon={<InfoOutlined />} className='error' size='1.2em' />,
		content,
		okButtonProps,
		cancelButtonProps,
		children,
		align = "end",
		position = "top",
		offset = 12,
		extra,
		onOk,
		onClose,
		...restProps
	} = props;

	const state = useReactive({
		loading: false,
		visible,
	});

	const ok: IButton = okButtonProps
		? Object.assign({}, defaultOk, okButtonProps)
		: defaultOk;
	const cancel: IButton = cancelButtonProps
		? Object.assign({}, defaultCancel, cancelButtonProps)
		: defaultCancel;

	const handleVisibleChange = (v: boolean) => {
		state.visible = v;
		restProps.onVisibleChange?.(v);
	};

	const handleOk = async (e: MouseEvent<HTMLElement>) => {
		state.loading = true;
		ok.onClick?.(e);

		onOk?.()
			?.then(() => {
				state.visible = false;
			})
			.finally(() => {
				state.loading = false;
			});
	};

	const handleCancel = async (e: MouseEvent<HTMLElement>) => {
		cancel.onClick?.(e);
		await onClose?.();
		state.visible = false;
	};

	const popconfirmContent = (
		<div className='i-popconfirm'>
			<Flex gap='.5em'>
				{icon}
				<div className='i-popconfirm-content'>{content}</div>
			</Flex>

			<Flex gap={12} justify='flex-end' className='i-popconfirm-footer'>
				{cancelButtonProps !== null && (
					<Button {...cancel} onClick={handleCancel} />
				)}
				{extra}
				{okButtonProps !== null && (
					<Button
						loading={state.loading}
						{...ok}
						onClick={handleOk}
					/>
				)}
			</Flex>
		</div>
	);

	return (
		<Popup
			content={popconfirmContent}
			{...restProps}
			trigger={trigger}
			visible={state.visible}
			align={align}
			offset={offset}
			position={position}
			onVisibleChange={handleVisibleChange}
		>
			{children}
		</Popup>
	);
};

export default Popconfirm;
