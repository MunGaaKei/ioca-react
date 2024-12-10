import classNames from "classnames";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Button from "../button";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { CompositionModal, IModal, IModalContent } from "./type";

function DefaultContent(props: IModalContent) {
	const {
		title,
		footer,
		hideCloseButton,
		footerLeft,
		okButtonProps = {
			children: "确定",
			onClick: props.onOk,
		},
		cancelButtonProps = {
			secondary: true,
			children: "关闭",
			onClick: props.onClose,
		},
		children,
		onClose,
	} = props;
	const showHeader = title || !hideCloseButton;

	const renderFooter = useMemo(() => {
		if (footer || footer === null) return footer;

		const propsOk = Object.assign({}, okButtonProps);
		const propsCancel = Object.assign({}, cancelButtonProps);

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
		width,
		height,
		customized,
		fixed,
		shadow = true,
		children,
		style,
		className,
		footerLeft,
		onVisibleChange,
		onClose,
		onOk,
		...restProps
	} = props;
	const [show, setShow] = useState(visible);
	const [active, setActive] = useState(false);
	const [bounced, setBounced] = useState(false);
	const toggable = useRef(true);

	const handleShow = useCallback(() => {
		if (!toggable.current) return;

		setShow(true);
		toggable.current = false;
		setTimeout(() => {
			setActive(true);
			onVisibleChange?.(true);
			toggable.current = true;
		}, 24);
	}, []);

	const handleHide = useCallback(() => {
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
			setShow(false);
			toggable.current = true;
			onVisibleChange?.(false);
			onClose?.();
		}, 240);
	}, [closable]);

	const handleBackdropClick = useCallback(
		function () {
			backdropClosable && handleHide();
		},
		[closable, backdropClosable]
	);

	useEffect(() => {
		visible ? handleShow() : handleHide();
	}, [visible]);

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
					shadow,
				})}
				style={{
					width,
					height,
				}}
				onClick={(e) => e.stopPropagation()}
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
		document.body
	);
}

export default Modal as CompositionModal;
