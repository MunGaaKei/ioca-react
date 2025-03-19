import classNames from "classnames";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useKeydown } from "../../js/hooks";
import Button from "../button";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { CompositionModal, IModal, IModalContent } from "./type";
import useModal from "./useModal";

function DefaultContent(props: IModalContent) {
	const {
		title,
		footer,
		hideCloseButton,
		footerLeft,
		okButtonProps,
		cancelButtonProps,
		children,
		onOk,
		onClose,
	} = props;
	const showHeader = title || !hideCloseButton;

	const handleOk = async () => {
		const ret = await onOk?.();

		if (ret) return;

		onClose?.();
	};

	const renderFooter = useMemo(() => {
		if (footer || footer === null) return footer;

		const propsOk = Object.assign(
			{
				children: "确定",
				onClick: handleOk,
			},
			okButtonProps
		);
		const propsCancel = Object.assign(
			{
				secondary: true,
				children: "关闭",
				onClick: onClose,
			},
			cancelButtonProps
		);

		return (
			<>
				{footerLeft}
				<Button {...propsOk} />
				<Button {...propsCancel} />
			</>
		);
	}, [footer, okButtonProps, cancelButtonProps]);

	return (
		<>
			{showHeader && (
				<header className='i-modal-header'>
					{title && <b>{title}</b>}

					<Helpericon
						active={!hideCloseButton}
						className='i-modal-close'
						onClick={onClose}
					/>
				</header>
			)}

			<div className='i-modal-content'>{children}</div>

			<footer className='i-modal-footer'>{renderFooter}</footer>
		</>
	);
}

function Modal(props: IModal) {
	const {
		visible,
		title,
		footer,
		okButtonProps,
		cancelButtonProps,
		closable = true,
		hideBackdrop,
		backdropClosable = true,
		hideCloseButton,
		disableEsc,
		width,
		height,
		customized,
		fixed,
		hideShadow,
		children,
		style,
		className,
		keepDOM,
		footerLeft,
		onClick,
		onVisibleChange,
		onClose,
		onOk,
		...restProps
	} = props;
	const [show, setShow] = useState(visible);
	const [active, setActive] = useState(false);
	const [bounced, setBounced] = useState(false);
	const toggable = useRef(true);

	const handleShow = () => {
		if (!toggable.current) return;

		(!keepDOM || !show) && setShow(true);
		toggable.current = false;
		setTimeout(() => {
			setActive(true);
			onVisibleChange?.(true);
			toggable.current = true;
		}, 24);
	};

	const handleHide = () => {
		if (!toggable.current) return;
		toggable.current = false;

		if (!closable) {
			setBounced(true);
			setTimeout(() => {
				setBounced(false);
				toggable.current = true;
			}, 400);
			return;
		}

		setActive(false);
		setTimeout(() => {
			!keepDOM && setShow(false);
			toggable.current = true;
			onVisibleChange?.(false);
			onClose?.();
		}, 240);
	};

	const handleBackdropClick = function () {
		backdropClosable && handleHide();
	};

	useKeydown(
		(e) => {
			if (e.code !== "Escape" || !visible) return;
			handleHide();
		},
		{ disabled: disableEsc }
	);

	useEffect(() => {
		visible ? handleShow() : handleHide();
	}, [visible]);

	const handleClick = () => {
		if (typeof document === "undefined") return;
		document.documentElement.click();
	};

	if (!show) return null;

	return createPortal(
		<div
			className={classNames(
				"i-modal-container",
				{
					"i-modal-backdrop": !hideBackdrop,
					"i-modal-customized": customized,
					"i-modal-active": active,
					fixed,
				},
				className
			)}
			style={style}
			onClick={handleBackdropClick}
		>
			<div
				className={classNames("i-modal", {
					bounced,
					shadow: !hideShadow,
				})}
				style={{
					width,
					height,
				}}
				onClick={(e) => {
					e.stopPropagation();
					handleClick();
					onClick?.(e);
				}}
				{...restProps}
			>
				{customized && children}

				{!customized && (
					<DefaultContent
						title={title}
						hideCloseButton={hideCloseButton}
						footer={footer}
						okButtonProps={okButtonProps}
						cancelButtonProps={cancelButtonProps}
						children={children}
						footerLeft={footerLeft}
						onOk={onOk}
						onClose={handleHide}
					/>
				)}
			</div>
		</div>,
		document?.body ?? null
	);
}

Modal.useModal = useModal;

export default Modal as CompositionModal;
