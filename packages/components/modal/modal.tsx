import classNames from "classnames";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useKeydown } from "../../js/hooks";
import Content from "./content";
import "./index.css";
import { CompositionModal, IModal } from "./type";
import useModal from "./useModal";

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
	const [mounted, setMounted] = useState(false);
	const toggable = useRef(true);

	const handleShow = async () => {
		if (!toggable.current) return;

		(!keepDOM || !show) && setShow(true);
		toggable.current = false;

		const timer = setTimeout(() => {
			setActive(true);
			onVisibleChange?.(true);
			toggable.current = true;
		}, 24);

		return () => clearTimeout(timer);
	};

	const handleHide = () => {
		if (!toggable.current) return;
		toggable.current = false;

		if (!closable) {
			setBounced(true);
			const timer = setTimeout(() => {
				setBounced(false);
				toggable.current = true;
			}, 400);
			return () => clearTimeout(timer);
		}

		setActive(false);
		const timer = setTimeout(() => {
			!keepDOM && setShow(false);
			toggable.current = true;
			onVisibleChange?.(false);
			onClose?.();
		}, 240);

		return () => clearTimeout(timer);
	};

	const handleBackdropClick = () => {
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

	useEffect(() => {
		setMounted(true);
	}, []);

	const handleClick = () => {
		if (typeof document === "undefined") return;
		document.documentElement.click();
	};

	if (!show || !mounted) return null;

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
			aria-modal='true'
			aria-hidden={!active}
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
				role='dialog'
				aria-labelledby={title ? "modal-title" : undefined}
				{...restProps}
			>
				{customized && children}

				{!customized && (
					<Content
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
