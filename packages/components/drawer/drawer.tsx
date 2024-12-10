import classNames from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Helpericon from "../utils/helpericon";
import "./index.css";
import { IDrawer } from "./type";

function Drawer(props: IDrawer) {
	const {
		visible,
		position = "left",
		header,
		footer,
		backdropClosable = true,
		hideCloseButton,
		className,
		children,
		onVisibleChange,
		onClose,
		...restProps
	} = props;
	const [show, setShow] = useState(visible);
	const [active, setActive] = useState(visible);
	const toggable = useRef(true);

	useEffect(() => {
		visible ? handleShow() : handleHide();
	}, [visible]);

	const handleShow = useCallback(() => {
		if (!toggable.current) return;

		setShow(true);
		onVisibleChange?.(true);
		toggable.current = false;
		setTimeout(() => {
			setActive(true);
			toggable.current = true;
		}, 24);
	}, []);

	const handleHide = useCallback(() => {
		if (!toggable.current) return;
		toggable.current = false;

		setActive(false);
		setTimeout(() => {
			setShow(false);
			onVisibleChange?.(false);
			toggable.current = true;
			onClose?.();
		}, 240);
	}, []);

	const handleBackdropClick = useCallback(function () {
		backdropClosable && handleHide();
	}, []);

	return createPortal(
		show && (
			<div
				className={classNames("i-backdrop-drawer", className, {
					"i-active": active,
				})}
				onClick={handleBackdropClick}
				{...restProps}
			>
				<div
					className={classNames("i-drawer", `i-drawer-${position}`)}
					onClick={(e) => e.stopPropagation()}
				>
					<header className='i-drawer-header'>
						{header}

						<Helpericon
							active={!hideCloseButton}
							className='i-drawer-close'
							onClick={handleHide}
						/>
					</header>

					<div className='i-drawer-content'>{children}</div>

					<div className='i-drawer-footer'>{footer}</div>
				</div>
			</div>
		),
		document.body
	);
}

export default Drawer;
