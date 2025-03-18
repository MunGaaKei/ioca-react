import { useReactive } from "ahooks";
import classNames from "classnames";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useKeydown } from "../../js/hooks";
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
		keepDOM,
		className,
		disabledEsc,
		children,
		onVisibleChange,
		onClose,
		...restProps
	} = props;
	const toggable = useRef(true);
	const state = useReactive({
		show: visible,
		active: visible,
		init: false,
	});

	useEffect(() => {
		visible ? handleShow() : handleHide();
	}, [visible]);

	const handleShow = () => {
		if (!toggable.current) return;

		state.show = true;
		onVisibleChange?.(true);
		toggable.current = false;
		setTimeout(() => {
			state.active = true;
			toggable.current = true;
			state.init = true;
		}, 24);
	};

	const handleHide = () => {
		if (!toggable.current) return;
		toggable.current = false;

		state.active = false;
		setTimeout(() => {
			if (!keepDOM) {
				state.show = false;
			}
			onVisibleChange?.(false);
			toggable.current = true;
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
		{
			disabled: disabledEsc,
		}
	);

	return createPortal(
		state.show && (
			<div
				className={classNames("i-backdrop-drawer", className, {
					"i-active": state.active,
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
		document?.body ?? null
	);
}

export default Drawer;
